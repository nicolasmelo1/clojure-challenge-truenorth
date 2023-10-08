(ns com.server-truenorth-challenge.operations.repository
  (:require
   [honey.sql :as sql]
   [com.server-truenorth-challenge.settings :as settings]
   [next.jdbc :as jdbc]))

(defn operations-get-all
  []
  (jdbc/execute!
   settings/db
   (sql/format
    {:select [:id :type :cost]
     :from [:operations]})))
