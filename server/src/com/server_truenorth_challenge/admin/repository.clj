(ns com.server-truenorth-challenge.admin.repository
  (:require
   [honey.sql :as sql]
   [next.jdbc :as jdbc]
   [com.server-truenorth-challenge.settings :as settings]))

(defn users-insert-new-with-username-and-password
  [username password]
  (try
    (second [(jdbc/execute!
              settings/db
              (sql/format
               {:insert-into :users
                :columns [:username :password :status]
                :values [[username password [:cast "active" :users_status]]]})) true]) (catch org.postgresql.util.PSQLException _ false)))