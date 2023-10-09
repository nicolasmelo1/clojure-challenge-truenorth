(ns com.server-truenorth-challenge.operations.plugin (:require [com.server-truenorth-challenge.operations.routes :as operations-routes]))

(def plugin {:api-routes ["/operations" [operations-routes/new-operation operations-routes/operations]]})