(ns com.server-truenorth-challenge.auth.services
  (:require
   [com.biffweb :as biff]
   [buddy.core.hash :as hash]
   [buddy.core.codecs :as codecs]
   [com.server-truenorth-challenge.auth.repository :as auth-repository]
   [com.server-truenorth-challenge.settings :as settings]))

(defn- create-tokens
  "Since we create tokens for both the access and refresh-tokens, we abstract away this logic on this function.\n
   This will retrieve a map with the keys :token and :refresh-token. The values for each key will be the encrypted token.\n
   Notice that, refresh-tokens will have a longer expiration time than access-tokens and should be user ONLY for refreshing the access-token.\n
   
   ### Args:
    **:user-id (int)**: The id of the user to encrypt the data in the token"
  [user-id]
  {:token (biff/jwt-encrypt {:user-id user-id :type "token" :exp-in settings/jwt-token-expiration-time} settings/jwt-secret)
   :refresh_token (biff/jwt-encrypt {:user-id user-id :type "refresh-token" :exp-in settings/jwt-refresh-token-expiration-time} settings/jwt-secret)})

(defn authenticate
  "Authenticate the user using the username and password provided.

   Returns a map with the keys :is-valid and :data.
   If :is-valid is true, :data will contain the keys :token and :refresh-token.
   If :is-valid is false, :data will be nil.
   
   ### Args:
    **:username (str)**: The username of the user\n
    **:password (str)**: The unhashed password of the user
  "
  [username password]
  (let [hashed-password (-> (hash/sha256 password)
                            (codecs/bytes->hex))]
    (if-let [user (-> (auth-repository/users-get-by-username-and-password username hashed-password) first)]
      {:is-valid true :data (create-tokens (:users/id user))}
      {:is-valid false :data nil})))

(defn user-get-by-id
  "Retrieves the user by the id provided. We will fetch just active users by default.\n
   We fetch just the \"id\", \"username\" and \"status\" columns.
   
   ### Args:
    **:id (int)**: The id of the user to fetch the data for"
  [id]
  (-> (auth-repository/user-get-by-id id) first))

(defn refresh-the-tokens
  "Just refresh the tokens using the refresh-token provided.\n
   
   ### Args:
    **:user-id (str)**: The user-id to create the tokens for"
  [user-id]
  (create-tokens user-id))

(defn create-user
  [username password]
  (let [hashed-password (-> (hash/sha256 password)
                            (codecs/bytes->hex))]
    (auth-repository/users-insert-new-with-username-and-password username hashed-password)))