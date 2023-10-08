(ns com.server-truenorth-challenge.operations.routes (:require
                                                      [com.server-truenorth-challenge.auth.middlewares :as auth-middlewares]
                                                      [com.server-truenorth-challenge.core.middlewares :as core-middlewares]
                                                      [com.server-truenorth-challenge.operations.schemas :as operations-schemas]))

(def new-operation
  ["/new-operation" {:middleware [auth-middlewares/jwt-authentication-middleware
                                  (core-middlewares/schema-validator-middleware-factory
                                   {:post operations-schemas/new-operation-body})]
                     :post (fn [ctx]
                             {:headers {"content-type" "application/json"}
                              :body {:id 123
                                     :name "Nicolas"
                                     :message "Olá mundo!!!"}})}])


(def operations
  ["/operations" {:middleware [auth-middlewares/jwt-authentication-middleware]
                  :get (fn [ctx]
                         {:headers {"content-type" "application/json"}
                          :body {:id 123
                                 :name "Nicolas"
                                 :message "Olá mundo!!!"}})}])