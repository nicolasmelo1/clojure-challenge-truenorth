(ns com.server-truenorth-challenge.operations.routes (:require
                                                      [com.server-truenorth-challenge.core.middlewares :as core-middlewares]
                                                      [com.server-truenorth-challenge.operations.schemas :as operations-schemas]))

(def new-operation
  ["/new-operation" {:middleware [(core-middlewares/wrap-validate-schema {:post operations-schemas/new-operation-body})]
                     :post (fn [ctx]
                             {:headers {"content-type" "application/json"}
                              :body {:id 123
                                     :name "Nicolas"
                                     :message "Olá mundo!!!"}})}])


(def operations
  ["/operations" {:get (fn [ctx]
                         {:headers {"content-type" "application/json"}
                          :body {:id 123
                                 :name "Nicolas"
                                 :message "Olá mundo!!!"}})}])