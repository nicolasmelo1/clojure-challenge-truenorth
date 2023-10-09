(ns com.server-truenorth-challenge.admin.routes
  (:require
   [com.server-truenorth-challenge.core.middlewares :as core-middlewares]
   [com.server-truenorth-challenge.auth.middlewares :as auth-middlewares]
   [com.server-truenorth-challenge.admin.schemas :as admin-schemas]
   [com.server-truenorth-challenge.admin.services :as admin-services]))


(def create-user
  ["/create-user" {:middleware [auth-middlewares/jwt-authentication-middleware
                                (core-middlewares/schema-validator-middleware-factory {:post admin-schemas/create-user})]
                   :post (fn [{:keys [body-params] :as _}]
                           (if (admin-services/create-user (:username body-params) (:password body-params))
                             {:body {:message "User created"} :status 201}
                             {:body {:user-create-error ["User already exists"]} :status 400}))}])
                        
              