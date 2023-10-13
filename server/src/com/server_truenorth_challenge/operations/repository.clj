(ns com.server-truenorth-challenge.operations.repository
  (:require
   [honey.sql :as sql]
   [next.jdbc :as jdbc]))

(defn operations-get-all
  [database]
  (jdbc/execute!
   database
   (sql/format
    {:select [:id :type :cost]
     :from [:operations]})))

(defn records-get-last-record-of-user
  [database user-id]
  (jdbc/execute!
   database
   (sql/format
    {:select [:user-balance]
     :from [:records]
     :where [:and [:= :user-id user-id] [:is :deleted_at nil]]
     :order-by [[:id :desc]]
     :limit 1})))

(defn records-bulk-insert
  [database user-id operations]
  (jdbc/execute!
   database (sql/format {:insert-into :records
                         :columns [:user-id :operation-id :amount :user-balance :operation-response]
                         :values (map (fn [operation] [user-id (:operation-id operation) (:amount operation) (:user-balance operation) (:result operation)]) (into [] operations))})))