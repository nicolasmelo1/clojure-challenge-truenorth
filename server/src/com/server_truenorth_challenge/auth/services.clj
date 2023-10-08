(ns com.server-truenorth-challenge.auth.services
  (:require
   [com.biffweb :as biff]
   [buddy.core.hash :as hash]
   [buddy.core.codecs :as codecs]
   [com.server-truenorth-challenge.auth.repository :as auth-repository]
   [com.server-truenorth-challenge.settings :as settings]))

(defn authenticate
  "Authenticate the user using the username and password provided.

   Returns a map with the keys :is-valid and :data.
   If :is-valid is true, :data will contain the keys :token and :refresh-token.
   If :is-valid is false, :data will be nil.
   
   ### Args:
    **username: (str)**: The username of the user\n
    **password: (str)**: The unhashed password of the user
  "
  [username password]
  (let [hashed-password (-> (hash/sha256 password)
                            (codecs/bytes->hex))]
    (if-let [user (-> (auth-repository/users-get-by-username-and-password username hashed-password) first)]
      {:is-valid true :data {:token (biff/jwt-encrypt {:user (:users/id user) :type " token " :exp-in settings/jwt-token-expiration-time} settings/jwt-secret)
                             :refresh-token (biff/jwt-encrypt {:user (:users/id user) :type " refresh-token " :exp-in settings/jwt-refresh-token-expiration-time} settings/jwt-secret)}}
      {:is-valid false :data nil})))