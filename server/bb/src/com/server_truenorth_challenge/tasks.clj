(ns com.server-truenorth-challenge.tasks (:require
                                          [com.server-truenorth-challenge.migrations.migrate :as migrate]
                                          [com.server-truenorth-challenge.migrations.rollback :as rollback]))

(def migrations-location "resources/migrations")
(def migrations-table-name "__migrations")

(def db {:dbtype "postgresql"
         :user "postgres"
         :dbname "postgres"
         :password ""
         :host "localhost"
         :port "5432"})

(defn migrate
  "This will run all of your pending migrations. This works similarly to Migratus library. But i needed to do it by hand."
  []
  (migrate/migrate db migrations-location migrations-table-name))

(defn rollback
  "This function will rollback all the migrations that have been run"
  []
  (rollback/rollback db migrations-location migrations-table-name {:until nil}))

(defn rollback-until
  "This function will rollback all the migrations that have been run until a certain migration name"
  [until]
  (rollback/rollback db migrations-location migrations-table-name {:until until}))

(defn create
  "Function used for creating a new migration file. Please provide the name of your migration."
  [migration-name]
  (let [current-time (quot (System/currentTimeMillis) 1000)
        first-line-on-migration-file (str "-- This was automatically generated at " current-time
                                          ". Please write your migration file down below and remove both comments.\n-- Use `bb run migrate` to "
                                          "run your migration. You can add multiple statements in a single file with `--;;`. Remove this line")]
    (spit (str migrations-location "/" current-time "-" migration-name ".up.sql") first-line-on-migration-file)
    (spit (str migrations-location "/" current-time "-" migration-name ".down.sql") first-line-on-migration-file)))