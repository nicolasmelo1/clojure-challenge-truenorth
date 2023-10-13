(ns com.server-truenorth-challenge.records.services
  (:require
   [clojure.string :as str]
   [com.server-truenorth-challenge.records.repository :as records-repository]
   [com.server-truenorth-challenge.settings :as settings]))

(defn- check-if-filter-values-matches-filter-key
  [key value]
  (cond
    (contains? #{:id :user-id :operation-id} key) (->> value (re-matches #"^\d+$") nil? not)
    (contains? #{:amount :user-balance} key) (->> value (re-matches #"^\d+(\.\d+)?$") nil? not)
    (= key :date) (->> value (re-matches #"^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}\.\d{3}Z)?$") nil? not)
    :else true))

(defn- get-filtered-filter-values
  [filter-fields filter-values filter-operations fields-that-support-between fields-that-support-lessthan-and-greaterthan]
  (let [filter-data (into [] (map vector filter-operations (map #(keyword %) filter-fields) filter-values))
        filtered-filter-data (filter (fn [[operation key value]]
                                       (cond (= operation "between")
                                             (if (or (-> value (str/split #"<->") count (= 2) not)
                                                     (true? (some false? (map #(check-if-filter-values-matches-filter-key key %) (str/split value #"<->"))))
                                                     (not (contains? fields-that-support-between key)))
                                               false
                                               true)
                                             (and (contains? #{"less-than" "greater-than"} operation)
                                                  (not (contains? fields-that-support-lessthan-and-greaterthan key))) false
                                             :else (check-if-filter-values-matches-filter-key key value)))
                                     filter-data)]
    (into [] filtered-filter-data)))

(defn get-records
  [user-id
   sorting-fields
   sorting-orders
   filter-fields
   filter-values
   filter-operations
   search
   page]
  (let [formatted-fetch-data (cond-> {}
                               (and (vector? sorting-fields) (vector? sorting-orders)) (assoc :sort (into [] (map vector (map #(keyword %) sorting-fields) sorting-orders))) ;;Reference: https://stackoverflow.com/a/2588408
                               (and (vector? filter-fields) (vector? filter-values)) (assoc :filter (get-filtered-filter-values filter-fields filter-values filter-operations #{:date :amount :user-balance} #{:date :amount :user-balance})) ;;Reference: https://stackoverflow.com/a/2588408
                               (string? search) (assoc :search search)
                               (and (string? page) (re-matches #"^\d+$" page)) (assoc :page (read-string page)))
        current-page (if (number? (:page formatted-fetch-data)) (:page formatted-fetch-data) 1)
        page-offset (if (number? current-page) (* settings/records-page-size (-> current-page (- 1))) settings/records-page-size)
        data-from-db (records-repository/records-get-all user-id (:sort formatted-fetch-data) (:filter formatted-fetch-data) (:search formatted-fetch-data) settings/records-page-size page-offset)
        total-pages (-> data-from-db :total first :total (/ settings/records-page-size) Math/ceil int)]
    {:pagination {:page (if (> current-page total-pages) total-pages current-page)
                  :total total-pages}
     :records (mapv (fn [value]
                      {:id (:records/id value)
                       :operation_type (:operations/operation_type value)
                       :amount (:records/amount value)
                       :user_balance (:records/user_balance value)
                       :operation_response (:records/operation_response value)
                       :date (:records/date value)}) (:records data-from-db))}))

(defn remove-record
  [user-id record-id]
  (records-repository/records-remove-record-by-id-and-user-id record-id user-id))