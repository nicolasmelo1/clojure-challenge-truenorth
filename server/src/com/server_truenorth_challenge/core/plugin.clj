(ns com.server-truenorth-challenge.core.plugin (:require [com.server-truenorth-challenge.core.routes :as core-routes]))

(def plugin {:api-routes [core-routes/healthcheck]})