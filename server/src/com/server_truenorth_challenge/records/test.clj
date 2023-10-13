(ns com.server-truenorth-challenge.records.test
  (:require
   [com.server-truenorth-challenge.records.services :as records-services]
   [clojure.test :as test]))

(defn retrieve-records [db user-id operations]
  (let [page (records-services/get-records db user-id nil nil nil nil nil nil 1)
        unknown-page (records-services/get-records db user-id nil nil nil nil nil nil 3)
        sorted (records-services/get-records db user-id ["operation-type"] ["desc"] nil nil nil nil 1)
        filtered-by-equal (records-services/get-records db user-id nil nil ["operation-type"] ["addition"] ["equal"] nil 1)
        filtered-by-not-equal (records-services/get-records db user-id nil nil ["operation-type"] ["addition"] ["not-equal"] nil 1)
        formatted-operations (->> operations (filter (fn [operation] (= (:is-valid operation) true))) (map (fn [operation] (:data operation))))]
    (test/deftest retrieve-records-test
      (test/is (= (:pagination page) {:page 1 :total 1}))
      (test/is (= (-> page :records last :operation_response) (-> formatted-operations first :result int str)))
      (test/is (= (-> page :records first :operation_response) (-> formatted-operations last :result str)))
      (test/is (= (-> unknown-page :records count (- 1)) (-> formatted-operations count)))
      (test/is (= (-> sorted :records first :operation_type) "random_string"))
      (test/is (= (-> filtered-by-equal :records count) 2))
      (test/is (= (-> filtered-by-not-equal :records count) 4)))))
