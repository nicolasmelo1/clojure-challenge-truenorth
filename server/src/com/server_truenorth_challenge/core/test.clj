(ns com.server-truenorth-challenge.core.test
  (:require
   [clojure.test :as test]
   [clojure.java.shell :as shell]
   [com.server-truenorth-challenge.core.utils :as core-utils]
   [com.server-truenorth-challenge.auth.test :as auth-test]
   [com.server-truenorth-challenge.operations.test :as operations-test]
   [com.server-truenorth-challenge.records.test :as records-test]))


(def test-db {:dbtype "postgresql"
              :user (core-utils/get-env-variable "DB_USER" str "postgres")
              :dbname (core-utils/get-env-variable "DB_NAME" str "postgres")
              :password (core-utils/get-env-variable "DB_PASS" str "")
              :host (core-utils/get-env-variable "DB_HOST" str "localhost")
              :port (core-utils/get-env-variable "DB_PORT" str "5433")
              :sslmode (core-utils/get-env-variable "DB_SSLMODE" str "disable")})

(test/deftest query-params-validation-test-invalid
  (let [{:keys [is-valid errors data]} (core-utils/query-params-validation
                                        {"filter-fields[]" ["field1"] "filter-values[]" ["value1"] "sorting-fields[]" ["field1"] "sorting-orders[]" ["asc"]}
                                        [[:filter-fields :filter-values :filter-operations]
                                         [:sorting-fields :sorting-orders]])]
    (test/is (= is-valid false))
    (test/is (= errors {:filter-fields ["Both query params should be defined"], :filter-values ["Both query params should be defined"], :filter-operations ["Both query params should be defined"]}))
    (test/is (= data {:filter-fields ["field1"], :filter-values ["value1"], :sorting-fields ["field1"], :sorting-orders ["asc"]}))))


(test/deftest query-params-validation-test-partial
  (let [{:keys [is-valid]} (core-utils/query-params-validation
                            {"filter-fields[]" ["field1"] "filter-values[]" ["value1"] "filter-operations[]" ["equals"]}
                            [[:filter-fields :filter-values :filter-operations]
                             [:sorting-fields :sorting-orders]])]
    (test/is (= is-valid true))))

(test/deftest query-params-validation-test-non-vector
  (let [{:keys [data]} (core-utils/query-params-validation
                        {"filter-fields[]" "field1" "filter-values[]" "value1" "filter-operations[]" "equals"}
                        [[:filter-fields :filter-values :filter-operations]
                         [:sorting-fields :sorting-orders]])]
    (test/is (= data {:filter-fields ["field1"], :filter-values ["value1"], :filter-operations ["equals"]}))))

(test/deftest services
  (query-params-validation-test-invalid)
  (query-params-validation-test-partial)
  (query-params-validation-test-non-vector)
  (shell/sh "bb" "run" "migrate-with" (:user test-db) (:dbname test-db) (str \" (:password test-db) \") (:host test-db) (:port test-db))
  (let [{:keys [username password]} {:username "test" :password "test"}
        _ ((auth-test/create-user test-db username password))
        [auth-test-authenticate _]  (auth-test/authenticate test-db username password)
        _ (auth-test-authenticate)
        [auth-test-user-by-username user-data] (auth-test/user-by-username test-db username)
        _ (auth-test-user-by-username)
        [auth-test-refresh-the-tokens _] (auth-test/refresh-the-tokens (:users/id user-data))
        _ (auth-test-refresh-the-tokens)
        [new-operations-test operations-results] (operations-test/new-operations test-db (:users/id user-data))
        _ (new-operations-test)
        _ ((records-test/retrieve-records test-db (:users/id user-data) operations-results))]
    (shell/sh "bb" "run" "rollback-with" (:user test-db) (:dbname test-db) (str \" (:password test-db) \") (:host test-db) (:port test-db))))
