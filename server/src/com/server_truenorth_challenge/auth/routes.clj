(ns com.server-truenorth-challenge.auth.routes
  (:require
   [com.server-truenorth-challenge.core.middlewares :as core-middlewares]
   [com.server-truenorth-challenge.auth.schemas :as auth-schemas]
   [com.server-truenorth-challenge.auth.services :as auth-services]
   [com.server-truenorth-challenge.auth.middlewares :as auth-middlewares]))

(def login
  ["/login" {:middleware [(core-middlewares/schema-validator-middleware-factory {:post auth-schemas/auth-body})]
             :post (fn [{:keys [body-params]}]
                     (let [jwt-token (auth-services/authenticate (:username body-params) (:password body-params))]
                       (if (:is-valid jwt-token)
                         {:body (:data jwt-token)}
                         {:body {:login-error ["Invalid username or password"]} :status 401})))}])

(def refresh-token
  ["/refresh-token" {:middleware [auth-middlewares/jwt-refresh-token-middleware]
                     :get (fn [{:keys [user]}]
                            {:body (auth-services/refresh-the-tokens (:users/id user))})}])
              