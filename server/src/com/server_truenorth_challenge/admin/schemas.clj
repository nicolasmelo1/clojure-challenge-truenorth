(ns com.server-truenorth-challenge.admin.schemas)

(def create-user
  [:map
   [:username :string]
   [:password :string]])