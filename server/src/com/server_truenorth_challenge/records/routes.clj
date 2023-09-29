(ns com.server-truenorth-challenge.records.routes (:require
                                                   [clojure.string :as str]
                                                   [com.server-truenorth-challenge.core.middlewares :as core-middlewares]))

(defn query-params-validation [query-params to-validate]
  (println query-params)
  (println to-validate)
  (let [formatted-query-params (reduce (fn [result [key value]] (assoc result (keyword (str/replace key #"\[\]" "")) value)) {} query-params)]
    (println (map (fn [{:keys [partial, keys]}] (let [data (reduce (fn [result [key value]] (assoc result (keyword key) value))
                                                                   {}
                                                                   (filter (fn [[key _]] (str/includes? key partial)) formatted-query-params))]
                                                  (println data) ;; o erro ta aqui
                                                  nil)) to-validate))))
  ;;(let [formatted-query-params (into {} (map (fn [[key value]] [(keyword (str/replace key #"\[\]" "")) value]) query-params));; remove [] from keys
   ;;     sorting-data (filter #(str/includes? % "sorting") formatted-query-params)
   ;;     vector-sorting-keys (into [] (keys sorting-data))
   ;;     does-contain-sorting-keys (and (some #(= % :sorting-orders) vector-sorting-keys) (some #(= % :sorting-fields) vector-sorting-keys))] ;; remove [] from keys
   ;; (println (some #(= % :sorting-orders) vector-sorting-keys))
   ;; (println vector-sorting-keys)))
        ;;sorting-data (filter #(str/includes? % "sorting") formatted-query-params)
        ;;vector-sorting-keys (into [] (keys sorting-data))]
    ;;(if (and (contains? (into [] (keys vector-sorting-keys)) "sorting-orders") (contains? (into [] (keys vector-sorting-keys)) "sorting-fields"))
      ;;(println "contains")
      ;;(println "not contains"))))

(def list-records
  ["/list" {:get (fn [{:keys [query-params] :as ctx}]
                   (query-params-validation query-params [{:partial "sorting"
                                                           :keys [:sorting-fields :sorting-orders]}])
                   {:headers {"content-type" "application/json"}
                    :body {:id 123
                           :name "Nicolas"
                           :message "Olá mundo!!!"}})}])
