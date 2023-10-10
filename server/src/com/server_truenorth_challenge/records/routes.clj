(ns com.server-truenorth-challenge.records.routes
  (:require
   [com.server-truenorth-challenge.records.schemas :as records-schemas]
   [com.server-truenorth-challenge.records.services :as records-services]
   [com.server-truenorth-challenge.core.middlewares :as core-middlewares]
   [com.server-truenorth-challenge.auth.middlewares :as auth-middlewares]))

(def list-records
  ["" {:middleware [auth-middlewares/jwt-authentication-middleware
                    (core-middlewares/query-params-schema-validator-middleware-factory
                     {:get records-schemas/query-params-records}
                     [[:filter-fields :filter-values :filter-operations]
                      [:sorting-fields :sorting-orders]])]
       :get (fn [{:keys [query-params user] :as _}]
              {:body (records-services/get-records
                      (:users/id user)
                      (:sorting-fields query-params)
                      (:sorting-orders query-params)
                      (:filter-fields query-params)
                      (:filter-values query-params)
                      (:filter-operations query-params)
                      (:search query-params)
                      (:page query-params))})}])
