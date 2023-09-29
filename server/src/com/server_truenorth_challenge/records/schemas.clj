(ns com.server-truenorth-challenge.records.schemas)

(def query-params-records
  [:map
   [:sorting-fields {:optional true} [:vector [:enum "id" "operation-id" "amount" "user-balance" "operation-response"]]]
   [:sorting-order {:optional true} [:enum "asc" "desc"]]
   [:filter-fields {:optional true} [:vector [:enum "id" "operation-id" "amount" "user-balance" "operation-response"]]]
   [:filter-values {:optional true} [:vector [:string]]]
   [:search {:optional true} :string]])