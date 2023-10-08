(ns com.server-truenorth-challenge.migrations.utils (:require [clojure.string :as str]))

(defn split-statements [query-file]
  (str/split query-file #"--;;"))

(defn get-migration-name [file]
  (get (str/split (.getName file) #"\.") 0))

(defn read-files [files callback]
  (doseq [file files]
    (let [data (slurp file)]
      (callback data (get-migration-name file)))))


(defn check-if-key-exists-in-vector
  "Checks if a given key exists in a vector. For example, if the key is \"sorting-fields\" and the vector is [\"sorting-fields\" \"sorting-orders\"], it will return true.
   
   ### Args:
   **:key (str)**: The key that should be checked if it exists in the vector\n
   **:vector (vector)**: The vector that should be checked if it contains the key"
  [key vector] (some true? (map (fn [key-to-validate] (= key-to-validate key)) vector)))
