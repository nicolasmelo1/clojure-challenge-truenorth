(ns com.server-truenorth-challenge.records.routes
  (:require
   [com.server-truenorth-challenge.records.schemas :as records-schemas]
   [com.server-truenorth-challenge.core.middlewares :as core-middlewares]
   [com.server-truenorth-challenge.auth.middlewares :as auth-middlewares]))

(def list-records
  ["/list" {:middleware [auth-middlewares/jwt-authentication-middleware
                         (core-middlewares/query-params-schema-validator-middleware-factory
                          {:get records-schemas/query-params-records}
                          [[:filter-fields :filter-values]
                           [:sorting-fields :sorting-orders]])]
            :get (fn [{:keys [query-params] :as ctx}]
                   {:headers {"content-type" "application/json"}
                    :body {:id 123
                           :name "Nicolas"
                           :message "Olá mundo!!!"}})}])
