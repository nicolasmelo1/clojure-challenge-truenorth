(ns com.server-truenorth-challenge.auth.repository
  (:require
   [honey.sql :as sql]
   [next.jdbc :as jdbc]))

(defn users-get-by-username-and-password
  [database username password]
  (jdbc/execute!
   database
   (sql/format
    {:select [:id :username :password]
     :from [:users]
     :where [:and [:= :username username]
             [:= :password password]
             [:= :status [:cast "active" :users_status]]]})))

(defn user-get-by-username
  [database username]
  (jdbc/execute!
   database
   (sql/format
    {:select [:id :username :status]
     :from :users
     :where [:and
             [:= :username username]
             [:= :status [:cast "active" :users_status]]]})))

(defn user-get-by-id
  [database id]
  (jdbc/execute!
   database
   (sql/format
    {:select [:id :username :status]
     :from :users
     :where [:and
             [:= :id id]
             [:= :status [:cast "active" :users_status]]]})))


(defn users-insert-new-with-username-and-password
  [database username password]
  (try
    (second [(jdbc/execute!
              database
              (sql/format
               {:insert-into :users
                :columns [:username :password :status]
                :values [[username password [:cast "active" :users_status]]]})) true]) (catch org.postgresql.util.PSQLException _ false)))