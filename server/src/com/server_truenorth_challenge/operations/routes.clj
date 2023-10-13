(ns com.server-truenorth-challenge.operations.routes (:require
                                                      [com.server-truenorth-challenge.auth.middlewares :as auth-middlewares]
                                                      [com.server-truenorth-challenge.core.middlewares :as core-middlewares]
                                                      [com.server-truenorth-challenge.operations.services.services :as operations-services]
                                                      [com.server-truenorth-challenge.operations.schemas :as operations-schemas]))

(def new-operation
  ["/new" {:middleware [auth-middlewares/jwt-authentication-middleware
                        (core-middlewares/schema-validator-middleware-factory
                         {:post operations-schemas/new-operation-schema})]
           :post (fn [{:keys [body-params user] :as _}]
                   (let [{:keys [is-valid reason data]} (operations-services/new-operation (:type body-params) (:expression body-params) (:users/id user))]
                     {:status (if (false? is-valid) 400 201)
                      :body (if (false? is-valid) {reason [(cond
                                                             (= reason :invalid-syntax) "The expression is invalid"
                                                             (= reason :not-enough-money) "Sadly, you do not have enough credits"
                                                             :else "Unkown error")]} data)}))}])

(def operations
  ["" {:middleware [auth-middlewares/jwt-authentication-middleware]
       :get (fn [_]
              {:body (operations-services/get-all-operations)})}])