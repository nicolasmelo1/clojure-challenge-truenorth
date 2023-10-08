(ns com.server-truenorth-challenge.admin.plugin (:require [com.server-truenorth-challenge.admin.routes :as admin-routes]))

(def plugin {:api-routes ["/admin" [admin-routes/create-user]]})