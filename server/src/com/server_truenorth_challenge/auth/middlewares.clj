(ns com.server-truenorth-challenge.auth.middlewares
  (:require
   [com.biffweb :as biff]
   [com.server-truenorth-challenge.auth.services :as auth-services]
   [com.server-truenorth-challenge.settings :as settings]))

(defn- get-header-or-query-params-value-by-key
  "Why is clojure so verbose? I mean. This pretty much extract a key from the header, like \"authorization\", and return its value, if exists.\n
   By default the header will be a map where the key is a string and the value should also be a string. Because on this map the keys are strings 
   we need to extract with filter
   
    ### Args:
    **:headers-or-query-params (map)**: The headers of the request.\n
    **:key (string)**: The key that should be extracted from the headers."
  [headers-or-query-params key]
  (->> headers-or-query-params (filter (fn [[key-of-headers-or-query-params]] (= key-of-headers-or-query-params key))) first last))

(defn- validate-token-and-send-response
  [handler jwt-token ctx token-type]
  (if-let [{:keys [user-id type]} (biff/jwt-decrypt jwt-token settings/jwt-secret)]
    (if (= type token-type)
      (if-let [user (auth-services/user-get-by-id user-id)]
        (handler (assoc ctx :user user))
        {:status 401
         :body {:jwt-error ["User does not exist or not active"]}})
      {:status 401
       :body {:jwt-error ["Invalid token type"]}})
    {:status 401
     :body {:jwt-error ["Invalid token"]}}))

(defn- jwt-refresh-or-access-token-validation
  [handler {:keys [headers query-params] :as ctx} token-type]
  (if-let [authorization-header (get-header-or-query-params-value-by-key headers "authorization")]
    (if-let [jwt-token (second (re-find #"Bearer (.*)" authorization-header))]
      (validate-token-and-send-response handler jwt-token ctx token-type)
      {:status 401
       :body {:jwt-error [(if (= token-type "token") "Token" "Refresh token") + " should follow the pattern Bearer <" + token-type + ">"]}})
    (if (= token-type "token")
      (if-let [jwt-token (get-header-or-query-params-value-by-key query-params token-type)]
        (validate-token-and-send-response handler jwt-token ctx token-type)
        {:status 401
         :body {:jwt-error ["Token should be defined either on the headers under \"authorization\" or on the query params using the parameter \"token\""]}})
      {:status 401
       :body {:jwt-error ["Refresh token should be defined either on the header under \"authorization\""]}})))

(defn jwt-authentication-middleware
  "Middleware used for validating the jwt token. If the token is not valid, it returns a 401 error with the errors of the token.
   This uses the biff library. By default, since we use Malli we are using a `malli-like` error approach, we send a map with the \"jwt-error\" key 
   and the value is a vector of strings.
   
   This will make it easier to validate on the frontend and parse.

   Important: This also supports token being passed on the query-params with \"token\" param. This is useful for images and places where you cannot set headers
   
    ### Example:
    ```clojure
    (def operations
    [\"/operations\" {:middleware [auth-middlewares/jwt-authentication-middleware]
                    :get (fn [ctx]
                           {:headers {\"content-type\" \"application/json\"}
                            :body {:id 123
                                   :name \"Nicolas\"
                                   :message \"Olá mundo!!!\"}})}])
    ```
   "
  [handler]
  (fn [ctx]
    (jwt-refresh-or-access-token-validation handler ctx "token")))

(defn jwt-refresh-token-middleware
  "Same as \"jwt-authentication-middleware\" function but used just for validating the refresh-tokens instead of the access tokens.
   Should be used just for refreshing the access-token and no other route should use it."
  [handler]
  (fn [ctx]
    (jwt-refresh-or-access-token-validation handler ctx "refresh-token")))

