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
        (= key :amount) [:cast value :double-precision]
        (= key :user-balance) [:cast value :double-precision]
        (= key :date) [:cast value :timestamp]
        :else value))

(defn- get-filter-value-by-operation-key-and-value
  [operation key value]
  (cond (= operation "equal") [:= key (cast-value-by-key key value)]
        (= operation "not-equal") [:not= key (cast-value-by-key key value)]
        (= operation "greater-than") [:> key (cast-value-by-key key value)]
        (= operation "less-than") [:< key (cast-value-by-key key value)]
        (= operation "between") [:between key (cast-value-by-key key (first (str/split value #"\<\-\>"))) (cast-value-by-key key (second (str/split value #"\<\-\>")))]
        :else
        [:= key (cast-value-by-key key value)]))

(defn records-get-all
  [sort filter search limit offset]
  (let [base-query {:select [:id :operation-id :user-id :amount :user-balance :operation-response :date]
                    :from [:records]}
        formatted-query-data (cond-> {:where [:and]
                                      :order-by []
                                      :limit limit}
                               (vector? sort) (assoc :order-by sort) ;;Reference: https://stackoverflow.com/a/2588408
                               (vector? filter) (#(assoc % :where
                                                         (reduce
                                                          (fn [result [operation key value]]
                                                            (conj result (get-filter-value-by-operation-key-and-value operation key value)))
                                                          (:where %) filter))) ;;Reference: https://stackoverflow.com/a/2588408 
                               (string? search)
                               (#(assoc % :where
                                        (conj (:where %) [:or
                                                          [:ilike :operation-response (str "%" search "%")]
                                                          [:ilike :operation-response (str "%" search "%")]]))) ;; TODO: This is NOT Working, need to fix this to search on the hole db
                               (number? offset) (assoc :offset offset))]
    {:total (jdbc/execute! settings/db (sql/format {:select [[[:count :*] :total]] :from [[(assoc (merge base-query (dissoc formatted-query-data :limit :offset)) :select [:id]) :sub]]}))
     :records (jdbc/execute! settings/db (sql/format (merge base-query (if (-> (:where formatted-query-data) (count) (<= 1)) (dissoc formatted-query-data :where) formatted-query-data))))}))
