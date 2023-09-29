(ns com.server-truenorth-challenge.auth.routes (:require
                                                [com.server-truenorth-challenge.core.middlewares :as middlewares]
                                                [com.server-truenorth-challenge.auth.schemas :as schemas]))

(def login
  ["/login" {:middleware [(middlewares/wrap-validate-schema {:post schemas/auth-body})]
             :post (fn [{:keys [request-method] :as ctx}]
                     (println (= request-method :post))
                     {:headers {"content-type" "application/json"}
                      :body {:id 123
                             :name "Nicolas"
                             :message "Olá mundo!!!"}})}])

