(ns com.server-truenorth-challenge.records.plugin (:require [com.server-truenorth-challenge.records.routes :as records-routes]))

(def plugin {:api-routes [records-routes/list-records]})