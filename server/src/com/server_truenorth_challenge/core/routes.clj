(ns com.server-truenorth-challenge.core.routes)

(def healthcheck
  ["/healthcheck" {:get (fn [{:keys [_]}]
                          {:body {:message "Ok"}})}])
