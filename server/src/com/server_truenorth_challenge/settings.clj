(ns com.server-truenorth-challenge.settings
  (:require
   [clojure.string :as string]
   [com.biffweb :as biff]))

(def app-name "Server Truenorth Challenge")

(defn get-env-variable [env-to-get func-to-parse default-value]
  (or (some-> (System/getenv env-to-get)
              func-to-parse)
      default-value))

(def jwt-secret (get-env-variable "JWT_SECRET"
                                  str
                                  "+kQTk9VfDyxGmfgm3N8fATqkbzOP5dbUkFFQe5Y3JxQ="))

(def jwt-token-expiration-time (get-env-variable "JWT_TOKEN_EXPIRATION_TIME" parse-long 14400)); 4 hours
(def jwt-refresh-token-expiration-time (get-env-variable "JWT_REFRESH_TOKEN_EXPIRATION_TIME" parse-long 15780000)) ; 6 months

(def default-user-balance 100)

(def allowed-hosts (string/split (get-env-variable "ALLOWED_HOSTS" str "http://localhost:5173") #","))

(def records-page-size 15)

(def db {:dbtype "postgresql"
         :user (get-env-variable "DB_USER" str "postgres")
         :dbname (get-env-variable "DB_NAME" str "postgres")
         :password (get-env-variable "DB_PASS" str "")
         :host (get-env-variable "DB_HOST" str "localhost")
         :port (get-env-variable "DB_PORT" str "5432")
         :sslmode (get-env-variable "DB_SSLMODE" str "disable")})
