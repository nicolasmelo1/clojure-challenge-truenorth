(ns com.server-truenorth-challenge.auth.routes
  (:require
   [com.server-truenorth-challenge.core.middlewares :as core-middlewares]
   [com.server-truenorth-challenge.auth.schemas :as auth-schemas]
   [com.server-truenorth-challenge.auth.services :as auth-services]))


(def login
  ["/login" {:middleware [(core-middlewares/schema-validator-middleware-factory {:post auth-schemas/auth-body})]
             :post (fn [{:keys [body-params] :as ctx}]
                     (let [jwt-token (auth-services/authenticate (:username body-params) (:password body-params))]
                       (if (:is-valid jwt-token)
                         {:body (:data jwt-token)}
                         {:body {:login-error ["Invalid username or password"]} :status 401})))}])
              