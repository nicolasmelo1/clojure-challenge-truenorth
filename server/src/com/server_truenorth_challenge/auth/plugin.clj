(ns com.server-truenorth-challenge.auth.plugin (:require [com.server-truenorth-challenge.auth.routes :as routes]))

(def plugin {:api-routes [routes/login]})