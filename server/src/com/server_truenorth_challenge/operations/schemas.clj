(ns com.server-truenorth-challenge.operations.schemas)

(def new-operation-schema
  [:map
   [:type [:enum "expression" "random-string"]]
   [:expression {:optional true} :string]])