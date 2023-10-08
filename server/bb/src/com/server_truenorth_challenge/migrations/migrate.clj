(ns com.server-truenorth-challenge.migrations.migrate (:require
                                                       [pod.babashka.postgresql :as pg]
                                                       [com.server-truenorth-challenge.migrations.utils :as utils]
                                                       [clojure.java.io :as io]
                                                       [clojure.string :as str]
                                                       [pod.babashka.postgresql.transaction :as tx]))

(defn get-up-migrations
  "This function will get all up migrations and filter just those that were not applied on the database"
  [db directory-location migrations-table-name]
  (let [directory (io/file directory-location)
        files (file-seq directory)
        applied-migrations (try (set (map :__migrations/name (pg/execute! db [(str "select name from " migrations-table-name)]))) (catch Throwable []))
        formatted-applied-migrations (into [] applied-migrations)]
    (filter #(and (str/includes? (.getName %) ".up.")
                  (not (utils/check-if-key-exists-in-vector (str/replace (.getName %) #".up.sql" "") formatted-applied-migrations))) (sort-by #(.getName %) files))))

(defn execute-migration-and-save [statements file-name db migrations-table-name]
  (println (str "Applying up migrations of file " file-name))
  (try
    (pg/with-transaction [tx/tx db]
      (doseq [statement statements]
        (pg/execute! tx/tx [statement]))
      (pg/execute! tx/tx [(str "insert into " migrations-table-name " (name) values ('" file-name "');")]))
    (catch Throwable e
      (println "Error executing query: \n" e))))

(defn migrate
  "This function will look for .up.sql files on the `migrations-directory-location` and run them if they were not applied to the database"
  [db directory-location migrations-table-name]
  (utils/read-files (get-up-migrations db directory-location migrations-table-name) #(execute-migration-and-save (utils/split-statements %1) %2 db migrations-table-name)))