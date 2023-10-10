(ns com.server-truenorth-challenge.records.repository
  (:require
   [honey.sql :as sql]
   [clojure.string :as str]
   [next.jdbc :as jdbc]
   [com.server-truenorth-challenge.settings :as settings]))

(defn- cast-value-by-key
  [key value]
  (cond (= key :id) [:cast value :int]
        (= key :user-id) [:cast value :int]
        (= key :operation-id) [:cast value :id]
        (= key :operation-response) [:cast value :varchar]
        (= key :operations.type) [:cast value :operations_type]
        (= key :amount) [:cast value :double-precision]
        (= key :user-balance) [:cast value :double-precision]
        (= key :date) [:cast value :timestamp]
        :else value))

(defn- get-filter-value-by-operation-key-and-value
  [operation key value]
  (println operation key value)
  (cond (= operation "equal") [:= key (cast-value-by-key key value)]
        (= operation "not-equal") [:not= key (cast-value-by-key key value)]
        (= operation "greater-than") [:> key (cast-value-by-key key value)]
        (= operation "less-than") [:< key (cast-value-by-key key value)]
        (= operation "between") [:between key (cast-value-by-key key (first (str/split value #"\<\-\>"))) (cast-value-by-key key (second (str/split value #"\<\-\>")))]
        :else
        [:= key (cast-value-by-key key value)]))

(defn records-get-all
  [user-id sort filter search limit offset]
  (let [base-query {:select [[:records.id :id]
                             [:operations.type :operation-type]
                             :amount
                             :user-balance
                             :operation-response
                             :date]
                    :from [:records]
                    :join-by  [:left [[:operations]
                                      [:= :operations.id :records.operation-id]]]}
        formatted-query-data (cond-> {:where [:and [:= :user_id user-id]]
                                      :order-by [[:id :desc]]
                                      :limit limit}
                               (vector? sort) (assoc :order-by (map (fn [[key value]] [(if (= key ::operation-type) :operations.type key) value]) sort)) ;;Reference: https://stackoverflow.com/a/2588408
                               (vector? filter) (#(assoc % :where
                                                         (reduce
                                                          (fn [result [operation key value]]
                                                            (conj result (get-filter-value-by-operation-key-and-value operation (if (= key :operation-type) :operations.type key) value)))
                                                          (:where %) filter))) ;;Reference: https://stackoverflow.com/a/2588408 
                               (string? search)
                               (#(assoc % :where
                                        (conj (:where %) [:or
                                                          [:ilike :operation-response (str "%" search "%")]
                                                          [:ilike :operation-response (str "%" search "%")]]))) ;; TODO: This is NOT Working, need to fix this to search on the hole db
                               (number? offset) (assoc :offset offset))
        query-data-without-limit-order-by-join-and-offset (dissoc formatted-query-data :limit :offset :order-by :join-by)
        query-data-without-empty-order-by (if (-> (:order-by formatted-query-data) (count) (< 1)) (dissoc formatted-query-data :order-by) formatted-query-data)
        merged-with-base-query (merge base-query query-data-without-empty-order-by)]
    (println (sql/format  merged-with-base-query))
    {:total (jdbc/execute! settings/db (sql/format {:select [[[:count :*] :total]] :from [[(assoc (merge base-query query-data-without-limit-order-by-join-and-offset) :select [[:records.id :id]]) :sub]]}))
     :records (jdbc/execute! settings/db (sql/format  merged-with-base-query))}))
