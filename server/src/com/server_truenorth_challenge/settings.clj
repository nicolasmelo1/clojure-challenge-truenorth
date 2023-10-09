(ns com.server-truenorth-challenge.settings
  (:require
   [com.biffweb :as biff]))

(def app-name "Server Truenorth Challenge")

(def jwt-secret "+kQTk9VfDyxGmfgm3N8fATqkbzOP5dbUkFFQe5Y3JxQ=")
(def jwt-token-expiration-time 14400) ; 4 hours
(def jwt-refresh-token-expiration-time 15780000) ; 6 months

(def default-user-balance 100)

(def records-page-size 2)
(def db {:dbtype "postgresql"
         :user "postgres"
         :dbname "postgres"
         :password ""
         :host "localhost"
         :port "5432"})