(ns com.server-truenorth-challenge.auth.schemas)

(def auth-body
  [:map
   [:username :string]
   [:password :string]])


(def create-user
  [:map
   [:username :string]
   [:password :string]])