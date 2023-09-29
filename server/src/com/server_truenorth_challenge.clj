(ns com.server-truenorth-challenge
  (:require [com.biffweb :as biff]
            [com.server-truenorth-challenge.email :as email]
            [com.server-truenorth-challenge.app :as app]
            [com.server-truenorth-challenge.home :as home]
            [com.server-truenorth-challenge.middleware :as mid]
            [com.server-truenorth-challenge.ui :as ui]
            [com.server-truenorth-challenge.worker :as worker]
            [com.server-truenorth-challenge.auth.plugin :as auth]
            [com.server-truenorth-challenge.operations.plugin :as operations]
            [com.server-truenorth-challenge.schema :as schema]
            [clojure.test :as test]
            [clojure.tools.logging :as log]
            [clojure.tools.namespace.repl :as tn-repl]
            [malli.core :as malc]
            [malli.registry :as malr]
            [nrepl.cmdline :as nrepl-cmd]))

(def plugins
  [app/plugin
   (biff/authentication-plugin {})
   auth/plugin
   operations/plugin
   home/plugin
   schema/plugin
   worker/plugin])

(def routes [["" {:middleware [mid/wrap-site-defaults]}
              (keep :routes plugins)]
             ["" {:middleware [mid/wrap-api-defaults]}
              (keep :api-routes plugins)]])

(def handler (-> (biff/reitit-handler {:routes routes})
                 mid/wrap-base-defaults))

(def static-pages (apply biff/safe-merge (map :static plugins)))

(defn generate-assets! [ctx]
  (biff/export-rum static-pages "target/resources/public")
  (biff/delete-old-files {:dir "target/resources/public"
                          :exts [".html"]}))

(defn on-save [ctx]
  (biff/add-libs)
  (biff/eval-files! ctx)
  (generate-assets! ctx)
  (test/run-all-tests #"com.server-truenorth-challenge.test.*"))

(def malli-opts
  {:registry (malr/composite-registry
              malc/default-registry
              (apply biff/safe-merge
                     (keep :schema plugins)))})

(def initial-system
  {:biff/plugins #'plugins
   :biff/send-email #'email/send-email
   :biff/handler #'handler
   :biff/malli-opts #'malli-opts
   :biff.beholder/on-save #'on-save
   :biff.middleware/on-error #'ui/on-error
   :biff.xtdb/tx-fns biff/tx-fns
   :com.server-truenorth-challenge/chat-clients (atom #{})})

(defonce system (atom {}))

(def components
  [biff/use-config
   biff/use-secrets
   biff/use-xt
   biff/use-queues
   biff/use-tx-listener
   biff/use-jetty
   biff/use-chime
   biff/use-beholder])

(defn start []
  (let [new-system (reduce (fn [system component]
                             (log/info "starting:" (str component))
                             (component system))
                           initial-system
                           components)]
    (reset! system new-system)
    (generate-assets! new-system)
    (log/info "System started.")
    (log/info "Go to" (:biff/base-url new-system))))

(defn -main [& args]
  (start)
  (apply nrepl-cmd/-main args))

(defn refresh []
  (doseq [f (:biff/stop @system)]
    (log/info "stopping:" (str f))
    (f))
  (tn-repl/refresh :after `start))
