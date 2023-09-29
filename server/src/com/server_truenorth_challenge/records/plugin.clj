(ns com.server-truenorth-challenge.records.plugin (:require [com.server-truenorth-challenge.operations.routes :as routes]))

(def plugin {:api-routes [routes/new-operation routes/operations]})