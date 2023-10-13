(ns com.server-truenorth-challenge.core.test
  (:require
   [com.server-truenorth-challenge.core.utils :as utils]
   [clojure.test :as test]))

(test/deftest query-params-validation-test-invalid
  (let [{:keys [is-valid errors data]} (utils/query-params-validation
                                        {"filter-fields[]" ["field1"] "filter-values[]" ["value1"] "sorting-fields[]" ["field1"] "sorting-orders[]" ["asc"]}
                                        [[:filter-fields :filter-values :filter-operations]
                                         [:sorting-fields :sorting-orders]])]
    (test/is (= is-valid false))
    (test/is (= errors {:filter-fields ["Both query params should be defined"], :filter-values ["Both query params should be defined"], :filter-operations ["Both query params should be defined"]}))
    (test/is (= data {:filter-fields ["field1"], :filter-values ["value1"], :sorting-fields ["field1"], :sorting-orders ["asc"]}))))


(test/deftest query-params-validation-test-partial
  (let [{:keys [is-valid]} (utils/query-params-validation
                            {"filter-fields[]" ["field1"] "filter-values[]" ["value1"] "filter-operations[]" ["equals"]}
                            [[:filter-fields :filter-values :filter-operations]
                             [:sorting-fields :sorting-orders]])]
    (test/is (= is-valid true))))

(test/deftest query-params-validation-test-non-vector
  (let [{:keys [data]} (utils/query-params-validation
                        {"filter-fields[]" "field1" "filter-values[]" "value1" "filter-operations[]" "equals"}
                        [[:filter-fields :filter-values :filter-operations]
                         [:sorting-fields :sorting-orders]])]
    (test/is (= data {:filter-fields ["field1"], :filter-values ["value1"], :filter-operations ["equals"]}))))