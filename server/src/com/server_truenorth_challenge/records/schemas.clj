(ns com.server-truenorth-challenge.records.schemas)

(def query-params-records
  [:map
   [:sorting {:optional true}
    [:map
     [[:field [:enum "id" "operation-id" "amount" "user-balance" "operation_response"]]
      [:order [:enum "asc" "desc"]]]]]
   [:filter {:optional true}
    [:map
     [[:field [:enum "id" "operation-id" "amount" "user-balance" "operation_response"]]
      [:value [:string]]]]]
   [:search {:optional true} :string]])