(ns com.server-truenorth-challenge.core.middlewares (:require [malli.core :as malli]
                                                              [malli.error :as malli-error]))


(defn wrap-validate-schema
  "Middleware used for validating the schema of the request body. If the schema is not valid, it returns a 400 error with the errors of the schema.
   This uses the malli library. See: https://github.com/metosin/malli"
  [schema-by-method]
  (fn [handler]
    (fn [{:keys [body-params request-method] :as ctx}]
      (let [schema-of-current-method (request-method schema-by-method)
            errors-of-body  (if (nil? schema-of-current-method) nil (-> schema-of-current-method (malli/explain body-params) (malli-error/humanize)))]
        (if (nil? errors-of-body)
          (handler ctx)
          {:headers {"content-type" "application/json"} :body errors-of-body :status 400})))))
