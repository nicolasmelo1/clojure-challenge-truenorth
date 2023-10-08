(ns com.server-truenorth-challenge.admin.services
  (:require
   [buddy.core.hash :as hash]
   [buddy.core.codecs :as codecs]
   [com.server-truenorth-challenge.admin.repository :as admin-repository]))


(defn create-user
  [username password]
  (let [hashed-password (-> (hash/sha256 password)
                            (codecs/bytes->hex))]
    (admin-repository/users-insert-new-with-username-and-password username hashed-password)))