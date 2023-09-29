(ns com.server-truenorth-challenge.operations.plugin (:require [com.server-truenorth-challenge.operations.routes :as routes]))

(def plugin {:api-routes [routes/new-operation routes/operations]})