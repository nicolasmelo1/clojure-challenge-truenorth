(ns com.server-truenorth-challenge.tasks (:require
                                          [com.server-truenorth-challenge.migrations.migrate :as migrate]
                                          [com.server-truenorth-challenge.migrations.rollback :as rollback]))

(def migrations-location "resources/migrations")
(def migrations-table-name "__migrations")

(defn get-env-variable [env-to-get func-to-parse default-value]
  (or (some-> (System/getenv env-to-get)
              func-to-parse)
      default-value))

(def db {:dbtype "postgresql"
         :user (get-env-variable "DB_USER" str "postgres")
         :dbname (get-env-variable "DB_NAME" str "postgres")
         :password (get-env-variable "DB_PASS" str "")
         :host (get-env-variable "DB_HOST" str "localhost")
         :port (get-env-variable "DB_PORT" str "5432")
         :sslmode (get-env-variable "DB_SSLMODE" str "disable")})

(defn migrate-with
  [db-user db-name db-pass db-host db-port]
  (println "Running migrations for " db-name " database.")
  (migrate/migrate {:dbtype "postgresql"
                    :user db-user
                    :dbname db-name
                    :password db-pass
                    :host db-host
                    :port (Integer/parseInt db-port)} migrations-location migrations-table-name))

(defn rollback-with
  [db-user db-name db-pass db-host db-port]
  (println "Rolling back for " db-name " database.")
  (rollback/rollback {:dbtype "postgresql"
                      :user db-user
                      :dbname db-name
                      :password db-pass
                      :host db-host
                      :port (Integer/parseInt db-port)} migrations-location migrations-table-name {:until nil}))

(defn migrate
  "This will run all of your pending migrations. This works similarly to Migratus library. But i needed to do it by hand."
  []
  (println "Running migrations")
  (migrate/migrate db migrations-location migrations-table-name))

(defn rollback
  "This function will rollback all the migrations that have been run"
  []
  (rollback/rollback db migrations-location migrations-table-name {:until nil}))

(defn rollback-until
  "This function will rollback all the migrations that have been run until a certain migration name.
   
   **Take Note**: We use `includes` function to get the migration name so you can use a part of the name. Also it's best practice if you specify the name with the `.down` extension.

   ### Example:
   ```shell
   $ bb run rollback-until operations.down
   ```
   "
  [until]
  (rollback/rollback db migrations-location migrations-table-name {:until until}))

(defn makemigration
  "Function used for creating a new migration file. Please provide the name of your migration."
  [migration-name]
  (let [current-time (quot (System/currentTimeMillis) 1000)
        first-line-on-migration-file (str "-- This was automatically generated at " current-time
                                          ". Please write your migration file down below and remove both comments.\n-- Use `bb run migrate` to "
                                          "run your migration. You can add multiple statements in a single file with `--;;`. Remove this line")]
    (spit (str migrations-location "/" current-time "-" migration-name ".up.sql") first-line-on-migration-file)
    (spit (str migrations-location "/" current-time "-" migration-name ".down.sql") first-line-on-migration-file)))