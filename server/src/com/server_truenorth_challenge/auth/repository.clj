(ns com.server-truenorth-challenge.auth.repository
  (:require
   [honey.sql :as sql]
   [com.server-truenorth-challenge.settings :as settings]
   [next.jdbc :as jdbc]))

(defn users-get-by-username-and-password
  [username password]
  (jdbc/execute!
   settings/db
   (sql/format
    {:select [:id :username :password]
     :from [:users]
     :where [:and [:= :username username]
             [:= :password password]
             [:= :status [:cast "active" :users_status]]]})))

(defn user-get-by-id
  [id]
  (jdbc/execute!
   settings/db
   (sql/format
    {:select [:id :username :status]
     :from :users
     :where [:and
             [:= :id id]
             [:= :status [:cast "active" :users_status]]]})))