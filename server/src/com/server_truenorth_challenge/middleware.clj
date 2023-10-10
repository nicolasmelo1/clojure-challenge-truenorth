(ns com.server-truenorth-challenge.middleware
  (:require [com.biffweb :as biff]
            [clojure.string :as str]
            [muuntaja.middleware :as muuntaja]
            [ring.middleware.anti-forgery :as csrf]
            [com.server-truenorth-challenge.settings :as settings]
            [ring.middleware.defaults :as rd]))

(defn cors-middleware [handler]
  (fn [ctx]
    (let [origin (->> ctx :headers (filter #(-> % (nth 0) (= "origin"))) first second)
          origin-allowed? (or (nil? origin) (some #(= origin %) settings/allowed-hosts))
          is-preflight (-> ctx :request-method (= :options))]

      (if is-preflight {:headers {"content-length" "0"
                                  "access-control-allow-origin" (str/join ", " settings/allowed-hosts)
                                  "access-control-allow-methods" "DELETE, GET, OPTIONS, PATCH, POST, PUT"
                                  "access-control-allow-headers" "Content-Type, Accept, Authorization, origin"
                                  "access-control-allow-credentials" "true"
                                  "access-control-max-age" "86400"}}
          (let [response (handler ctx)]
            (if origin-allowed?
              (assoc response :headers (assoc (:headers response) "access-control-allow-origin" origin))
              response))))))

;; Stick this function somewhere in your middleware stack below if you want to
;; inspect what things look like before/after certain middleware fns run.
(defn wrap-debug [handler]
  (fn [ctx]
    (let [response (handler ctx)]
      (println "REQUEST")
      (biff/pprint ctx)
      (def ctx* ctx)
      (println "RESPONSE")
      (biff/pprint response)
      (def response* response)
      response)))

(defn wrap-site-defaults [handler]
  (-> handler
      biff/wrap-render-rum
      biff/wrap-anti-forgery-websockets
      csrf/wrap-anti-forgery
      biff/wrap-session
      muuntaja/wrap-params
      muuntaja/wrap-format
      (rd/wrap-defaults (-> rd/site-defaults
                            (assoc-in [:security :anti-forgery] false)
                            (assoc-in [:responses :absolute-redirects] true)
                            (assoc :session false)
                            (assoc :static false)))))

(defn wrap-api-defaults [handler]
  (-> handler
      muuntaja/wrap-params
      muuntaja/wrap-format
      (rd/wrap-defaults rd/api-defaults)))

(defn wrap-base-defaults [handler]
  (-> handler
      biff/wrap-https-scheme
      biff/wrap-resource
      biff/wrap-internal-error
      biff/wrap-ssl
      biff/wrap-log-requests))
