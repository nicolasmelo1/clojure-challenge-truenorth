(ns com.server-truenorth-challenge.auth.test
  (:require
   [clojure.test :as test]
   [com.server-truenorth-challenge.auth.services :as auth-services]
   [com.server-truenorth-challenge.auth.repository :as auth-repository]))

(defn create-user [db email password]
  (test/deftest create-user-test
    (let [was-user-created (auth-services/create-user db email password)]
      (test/is (= was-user-created true)))))

(defn authenticate [db email password]
  (let [auth-result (auth-services/authenticate db email password)]
    [(test/deftest authenticate-test
       (test/is (= (:is-valid auth-result) true))
       (test/is (not= (:data auth-result) nil))
       (test/is (= (contains? (:data auth-result) :token) true))
       (test/is (= (contains? (:data auth-result) :refresh_token) true))) auth-result]))

(defn user-by-username [db email]
  (let [users (auth-repository/user-get-by-username db email)
        user (-> users first)]
    [(test/deftest user-by-user-name-test
       (test/is (not= user nil))
       (test/is (= (:users/username user) email)))
     user]))

(defn refresh-the-tokens [user-id]
  (let [refresh-token-result (auth-services/refresh-the-tokens user-id)]
    [(test/deftest refresh-token-test
       (test/is (= (contains? refresh-token-result :token) true))
       (test/is (= (contains? refresh-token-result :refresh_token) true))) refresh-token-result]))
