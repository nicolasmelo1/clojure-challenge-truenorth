(ns com.server-truenorth-challenge.settings
  (:require
   [com.server-truenorth-challenge.core.utils :as core-utils]
   [clojure.string :as string]
   [com.biffweb :as biff]))

(def app-name "Server Truenorth Challenge")

(defn get-random-string-callback []
  (-> "https://www.random.org/strings/?num=1&len=20&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new" slurp))

(def jwt-secret (core-utils/get-env-variable "JWT_SECRET"
                                             str
                                             "+kQTk9VfDyxGmfgm3N8fATqkbzOP5dbUkFFQe5Y3JxQ="))

(def jwt-token-expiration-time (core-utils/get-env-variable "JWT_TOKEN_EXPIRATION_TIME" parse-long 14400)); 4 hours
(def jwt-refresh-token-expiration-time (core-utils/get-env-variable "JWT_REFRESH_TOKEN_EXPIRATION_TIME" parse-long 15780000)) ; 6 months

(def default-user-balance 100)

(def allowed-hosts (string/split (core-utils/get-env-variable "ALLOWED_HOSTS" str "http://localhost:5173") #","))

(def records-page-size 15)

(def db {:dbtype "postgresql"
         :user (core-utils/get-env-variable "DB_USER" str "postgres")
         :dbname (core-utils/get-env-variable "DB_NAME" str "postgres")
         :password (core-utils/get-env-variable "DB_PASS" str "")
         :host (core-utils/get-env-variable "DB_HOST" str "localhost")
         :port (core-utils/get-env-variable "DB_PORT" str "5432")
         :sslmode (core-utils/get-env-variable "DB_SSLMODE" str "disable")})