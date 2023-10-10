(ns com.server-truenorth-challenge.records.plugin (:require [com.server-truenorth-challenge.records.routes :as records-routes]))

(def plugin {:api-routes ["/records" [records-routes/list-records records-routes/remove-record]]})