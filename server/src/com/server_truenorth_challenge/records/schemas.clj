(ns com.server-truenorth-challenge.records.schemas)

(def query-params-records
  [:map
   [:sorting-fields {:optional true} [:vector [:enum "id" "operation-type" "amount" "user-balance" "operation-response" "date"]]]
   [:sorting-orders {:optional true} [:vector [:enum "asc" "desc"]]]
   [:filter-fields {:optional true} [:vector [:enum "id" "operation-type" "amount" "user-balance" "operation-response" "date"]]]
   [:filter-operations {:optional true} [:vector [:enum "equal" "between" "not-equal" "greater-than" "less-than"]]]
   [:filter-values {:optional true} [:vector [:string]]]
   [:search {:optional true} :string]
   [:page {:optional true} [:re {:error/message "should be a number"} #"^\d+$"]]])