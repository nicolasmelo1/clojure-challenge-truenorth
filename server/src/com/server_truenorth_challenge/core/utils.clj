(ns com.server-truenorth-challenge.core.utils
  (:require [clojure.string :as str]))

(defn- nicely-format-error-messages
  "This will format the error messages so it is flattened and will look identical to [\"Mallis\"](https://github.com/metosin/malli) library\n
   This is important because for the frontend it should not have any distinction. It would be bad to try to parse different formats of error messages.

   ### Example:
   ```clojure
    (nicely-format-error-messages 
      [{
        :reason {
          :filter-fields [Both query params should be defined] 
          :filter-values [Both query params should be defined]
        } 
       } {
        :reason {
          :sorting-fields [Query params should have the same length] 
          :sorting-orders [Query params should have the same length]
        }
      }] 
   
   ; will be formatted to:
   {
     :filter-fields [\"Both query params should be defined\"]
     :filter-values [\"Both query params should be defined\"]
     :sorting-fields [\"Query params should have the same length\"]
     :sorting-orders [\"Query params should have the same length\"]
   }
   ```

   ### Args:
   **:errors (vector)**: The errors that should be formatted. It will be a vector of maps where each map will have the key \"reason\" and the value will be a vector of strings."
  [errors]
  (let [errors-reasons-set (map (fn [{:keys [reason]}] reason) errors)]
    (reduce (fn [result error-reasons] (merge result error-reasons)) {} errors-reasons-set)))

(defn- does-query-params-contains-required-keys
  "Checks if the query params contains the combined keys and pretty much validates the combined keys together. For example, if the combined keys are [:sorting-fields :sorting-orders]
   it will check if the query params contains both keys and if they have the same length. If they don't have the same length, it will return an error message.
   
   ### Args:
   **:formatted-query-params-without-vector (map)**: The result of \"format-query-params\" function.\n
   **:partial (str)**: The partial of the combined keys. For example, if the combined keys are [:sorting-fields :sorting-orders], the partial will be \"sorting\".\n
   **:combined-keys (vector)**: The combined keys that should be validated together. For example, [:sorting-fields :sorting-orders]"
  [formatted-query-params-without-vector partial combined-keys]
  (let [data (reduce (fn [result [key value]] (assoc result key value))
                     {}
                     (filter (fn [[key _]] (str/includes? key partial)) formatted-query-params-without-vector))
        exists-combined-keys (every? true? (map (fn [combined-key] (some #(= % combined-key) (keys data))) combined-keys))
        is-all-same-length (if (empty? data) true (apply = (map count (vals data))))]
    {:is-valid (if (empty? data) true (and exists-combined-keys is-all-same-length))
     :reason (if (false? exists-combined-keys) (reduce (fn [result key] (assoc result key ["Both query params should be defined"])) {} combined-keys)
                 (if (false? is-all-same-length) (reduce (fn [result key] (assoc result key ["Query params should have the same length"])) {} combined-keys) ""))
     :query-params combined-keys}))

(defn- get-partial-from-combined-keys
  "For the given keys [:sorting-fields :sorting-orders]. The partial will be the first part of each key, so \"sorting\" will be the partial.
   
   ### Args:
   **:combined-keys (vector)**: The combined keys that should be validated together. For example, [:sorting-fields :sorting-orders]"
  [combined-keys] (name (get (str/split (name (get combined-keys 0)) #"-") 0)))

(defn- replace-array-query-params-names
  "Used for replacing the array query params names. For example, sorting-fields[] will be replaced by sorting-fields.
   
   ### Args:
   **:query-param-key (str)**: The query param key that should be replaced. For example, \"sorting-fields[]\""
  [query-param-key] (keyword (str/replace query-param-key #"\[\]" "")))

(defn check-if-key-exists-in-vector
  "Checks if a given key exists in a vector. For example, if the key is \"sorting-fields\" and the vector is [\"sorting-fields\" \"sorting-orders\"], it will return true.
   
   ### Args:
   **:key (str)**: The key that should be checked if it exists in the vector\n
   **:vector (vector)**: The vector that should be checked if it contains the key"
  [key vector] (some true? (map (fn [key-to-validate] (= key-to-validate key)) vector)))

(defn- format-query-params
  "Will format the query params received from the request. The query param should be a map, a non-nested map.
   For example, if the query params are: sorting-fields[]=name&sorting-fields[]=age&sorting-orders[]=asc&sorting-orders[]=desc
   The query params should be formatted to: {:sorting-fields [\"name\" \"age\"] :sorting-orders [\"asc\" \"desc\"]}\n\n
   By default if we have only one value, the value will NOT be a vector, so we should guarantee it is a vector
   
   ### Args:
   **:query-params (map)**: The query params received from the request\n
   **:to-validate (vector)**: The query params that should be validated. It is a vector of vectors where the each vector is the combined keys that should be validated together.
   For example, [[:sorting-fields :sorting-orders] [:filter-fields :filter-values]]"
  [query-params to-validate]
  (let [flattened-to-validate (flatten to-validate)]
    (reduce (fn [result [key value]]
              (assoc result (replace-array-query-params-names key)
                     (if (and (check-if-key-exists-in-vector (replace-array-query-params-names key) flattened-to-validate) (not (vector? value))) [value] value))) {} query-params)))

(defn query-params-validation
  "Validates if the query-params contains the required keys and if the values are valid. Since those are query params, query params should be flattened, 
   so the keys should be in the format: sorting-fields[] and sorting-orders[]. Those are two distinct keys, but they are related, so they should be validated together.
   
   ### Args:
   **:query-params (map)**: The query params received from the request\n
   **:to-validate (vector)**: The query params that should be validated. It is a vector of vectors where the each vector is the combined keys that should be validated together.
   For example, [[:sorting-fields :sorting-orders] [:filter-fields :filter-values]]"
  [query-params to-validate]
  (let [formatted-query-params (format-query-params query-params to-validate)
        to-validate-validated-data (map (fn [combined-keys]
                                          (does-query-params-contains-required-keys formatted-query-params (get-partial-from-combined-keys combined-keys) combined-keys)) to-validate)
        is-valid-query-params (every? (fn [{:keys [is-valid]}] is-valid) to-validate-validated-data)
        filtered-errors (filter (fn [{:keys [is-valid]}] (false? is-valid)) to-validate-validated-data)]
    {:is-valid is-valid-query-params
     :errors (nicely-format-error-messages filtered-errors)
     :data formatted-query-params}))
