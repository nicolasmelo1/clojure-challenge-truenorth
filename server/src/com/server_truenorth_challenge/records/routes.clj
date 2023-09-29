(ns com.server-truenorth-challenge.records.routes (:require
                                                   [com.server-truenorth-challenge.core.middlewares :as middlewares]
                                                   [com.server-truenorth-challenge.operations.schemas :as schemas]))

(def new-operation
  ["/new-operation" {:middleware [(middlewares/wrap-validate-schema {:post schemas/new-operation-body})]
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