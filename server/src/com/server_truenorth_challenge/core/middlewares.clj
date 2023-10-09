(ns com.server-truenorth-challenge.core.middlewares
  (:require
   [com.server-truenorth-challenge.core.utils :as records-utils]
   [malli.core :as malli]
   [malli.error :as malli-error]))


(defn schema-validator-middleware-factory
  "Middleware used for validating the schema of the request body or other parts of the request like the query params. 
   If the schema is not valid, it returns a 400 error with the errors of the schema.
   This uses the malli library. See: https://github.com/metosin/malli
   
   By default this validates only the request body, but it can be used to validate other parts of the request like the query params.
   For that you should pass a map where the key is the part of the request that should be validated and the value is the schema to validate.
   
   ### Example:
   ```clojure
   ; This will validate the query params instead of the body for the GET request
   (def list-records
   [\"/list\" {:middleware [(core-middlewares/schema-validator-middleware-factory
                          {:get {:where-to-validate :query-params
                                 :schema records-schemas/query-params-records}})]
            :get (fn [{:keys [query-params] :as ctx}]
                   {:headers {\"content-type\" \"application/json\"}
                    :body {:hello \"world\"}})}])
   ```

  ### Example:
   ```clojure
   ; This will validate the body for the POST request
   (def list-records
   [\"/list\" {:middleware [(core-middlewares/schema-validator-middleware-factory
                          {:post records-schemas/query-params-records})]
            :post (fn [{:keys [query-params] :as ctx}]
                   {:headers {\"content-type\" \"application/json\"}
                    :body {:hello \"world\"}})}])
   ```

   ### Args:
   **:schema-by-method-or-where-to-validate (map)**: A map where the key is the method of the request and the value is the schema to validate the request body or a map containing 
   the key \"where-to-validate\" that would be one of the keys of the _ctx_ from the request, and a second key \"schema\" that will contain the malli schema to validate the query params.\n"
  [schema-by-method-or-where-to-validate]
  (fn [handler]
    (fn [ctx]
      (let [schema-of-current-method-or-where-to-validate ((:request-method ctx) schema-by-method-or-where-to-validate)
            [where-to-extreact-data schema-of-current-method] (if (map? schema-of-current-method-or-where-to-validate)
                                                                [(:where-to-validate schema-of-current-method-or-where-to-validate) (:schema schema-of-current-method-or-where-to-validate)]
                                                                [:body-params schema-of-current-method-or-where-to-validate])
            errors-of-body  (if (nil? schema-of-current-method) nil (-> schema-of-current-method (malli/explain (where-to-extreact-data ctx)) (malli-error/humanize)))]
        (if (nil? errors-of-body)
          (handler ctx)
          {:headers {"content-type" "application/json"} :body errors-of-body :status 400})))))

(defn- format-schema-for-query-params-validation
  "Formats the schema for query-params validation, it will use the \"schema-validator-middleware-factory\" function so we need to guarantee
   that we are validating the query-params and not the body, so we should parse the schema for this validation
   
   The function \"schema-validator-middleware-factory\" permits to validate not only the body but all parts of the request, with that function,
   on \"query-params-schema-validator-middleware-factory\" function the user does not need to define the schema on the {:schema :where-to-validate} map."
  [to-validate-data]
  (reduce
   (fn [result [key value]]
     (assoc result key
            (if (map? value)
              value
              {:where-to-validate :query-params
               :schema value}))) {} to-validate-data))

(defn query-params-schema-validator-middleware-factory
  "This middleware is used to validate the query params. Query params should be flattened, query param by default does not support nesting.
   But for example, let's say that a query param is a vector we should check if two query params, that are together, has the same length.
   It that's the casa we continue, otherwise we will fail the request. "
  [schema query-params-validation-data]
  (fn [handler]
    (fn [{:keys [query-params] :as ctx}]
      (let [schema-formatted (format-schema-for-query-params-validation schema)
            schema-validator ((schema-validator-middleware-factory schema-formatted) handler)
            validation-data (records-utils/query-params-validation query-params query-params-validation-data)]
        (if (true? (:is-valid validation-data)) (schema-validator (assoc ctx :query-params (:data validation-data)))
            {:headers {"content-type" "application/json"} :body (:errors validation-data) :status 400})))))

(defn- get-status
  [status-code]
  (if (nil? status-code)
    "success"
    (cond
      (<= 500 status-code 599) "server-error"
      (<= 400 status-code 499) "client-error"
      (<= 300 status-code 399) "redirect"
      (<= 200 status-code 299) "success"
      :else "success")))

(defn format-response-middleware
  "Middleware used for formatting the response. This will format the response to be a JSON response.
   This will also add the headers to the response, like the content-type header."
  [handler]
  (fn [ctx]
    (let [response (handler ctx)
          formated-body-response (if (or (map? (:body response))
                                         (vector? (:body response))
                                         (string? (:body response))
                                         (number? (:body response))
                                         (boolean? (:body response))
                                         (nil? (:body response)))
                                   (assoc response :body {:status (get-status (:status response)) :data (:body response)})
                                   (:body response))]
      (assoc formated-body-response :headers (assoc (:headers formated-body-response) "content-type" "application/json")))))