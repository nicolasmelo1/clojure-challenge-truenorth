(ns com.server-truenorth-challenge.migrations.utils (:require [clojure.string :as str]))

(defn split-statements [query-file]
  (str/split query-file #"--;;"))

(defn get-migration-name [file]
  (get (str/split (.getName file) #"\.") 0))

(defn read-files [files callback]
  (doseq [file files]
    (let [data (slurp file)]
      (callback data (get-migration-name file)))))

(defn take-while-plus-one
  "Lazily returns successive items from coll while (pred item) returns true,
  then an additional n items. pred must partition coll into segments of finite length."
  [pred coll]
  (if (pred (first coll))
    (let [[head & tails] (partition-by pred coll)]
      (lazy-cat head (->> tails flatten (take 1))))
    (take 1 coll)))

(defn check-if-key-exists-in-vector
  "Checks if a given key exists in a vector. For example, if the key is \"sorting-fields\" and the vector is [\"sorting-fields\" \"sorting-orders\"], it will return true.
   
   ### Args:
   **:key (str)**: The key that should be checked if it exists in the vector\n
   **:vector (vector)**: The vector that should be checked if it contains the key"
  [key vector] (some true? (map (fn [key-to-validate] (= key-to-validate key)) vector)))
