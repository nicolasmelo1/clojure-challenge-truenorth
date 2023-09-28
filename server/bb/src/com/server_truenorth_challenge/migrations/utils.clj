(ns com.server-truenorth-challenge.migrations.utils (:require [clojure.string :as str]))

(defn split-statements [query-file]
  (str/split query-file #"--;;"))

(defn get-migration-name [file]
  (get (str/split (.getName file) #"\.") 0))

(defn read-files [files callback]
  (doseq [file files]
    (let [data (slurp file)]
      (callback data (get-migration-name file)))))
