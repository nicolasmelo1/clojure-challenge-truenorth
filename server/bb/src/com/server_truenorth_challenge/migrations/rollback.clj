(ns com.server-truenorth-challenge.migrations.rollback (:require
                                                        [pod.babashka.postgresql :as pg]
                                                        [com.server-truenorth-challenge.migrations.utils :as utils]
                                                        [clojure.java.io :as io]
                                                        [clojure.string :as str]
                                                        [pod.babashka.postgresql.transaction :as tx]))


(defn get-files-sorted-and-until-if-defined
  [files until]
  (if (string? until)
    (utils/take-while-plus-one #(not (str/includes? (.getName %) until)) (reverse (sort-by #(.getName %) files)))
    (reverse (sort-by #(.getName %) files))))

(defn get-down-migrations
  "This function will get all down migrations that were applied to the database"
  [db directory-location migrations-table-name until]
  (let [directory (io/file directory-location)
        files (file-seq directory)
        applied-migrations-down-file-name (try (set (map #(str (get % :__migrations/name) ".down.sql") (pg/execute! db [(str "select name from " migrations-table-name)]))) (catch Throwable []))]
    (filter #(and (str/includes? (.getName %) ".down.")
                  (contains? applied-migrations-down-file-name (.getName %))) (get-files-sorted-and-until-if-defined files until))))

(defn execute-down-migration-and-remove
  [statements file-name db migrations-table-name]
  (println (str "Applying DOWN migrations of file " file-name))
  (try
    (pg/with-transaction [tx/tx db]
      (doseq [statement statements]
        (pg/execute! tx/tx [statement]))
      (pg/execute! tx/tx [(str "delete from " migrations-table-name " where name='" file-name "';")]))
    (catch Throwable e
      (println "Error executing query: \n" e))))

(defn rollback
  [db directory-location migrations-table-name {:keys [until]}]
  (utils/read-files (get-down-migrations db directory-location migrations-table-name until) #(execute-down-migration-and-remove (utils/split-statements %1) %2 db migrations-table-name)))