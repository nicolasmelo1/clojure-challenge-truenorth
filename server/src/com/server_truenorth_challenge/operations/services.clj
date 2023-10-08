(ns com.server-truenorth-challenge.operations.services
  (:require
   [com.server-truenorth-challenge.operations.repository :as operations-repository]))

(defn get-all-operations
  []
  (operations-repository/operations-get-all))