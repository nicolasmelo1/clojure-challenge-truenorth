(ns com.server-truenorth-challenge.auth.plugin (:require [com.server-truenorth-challenge.auth.routes :as auth-routes]))

(def plugin {:api-routes [auth-routes/login]})