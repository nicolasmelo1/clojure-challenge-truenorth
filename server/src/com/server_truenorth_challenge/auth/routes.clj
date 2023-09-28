(ns com.server-truenorth-challenge.auth.routes)

(defn login [{headers :headers}]
  (println (get headers "host"))
  {:headers {"content-type" "application/json"}
   :body {:id 123
          :name "Nicolas"
          :message "Olá mundo!!!"}})

