(ns com.server-truenorth-challenge.operations.services.services (:require
                                                                 [com.server-truenorth-challenge.settings :as settings]
                                                                 [com.server-truenorth-challenge.operations.services.lexer :as lexer]
                                                                 [com.server-truenorth-challenge.operations.services.parser :as parser]
                                                                 [com.server-truenorth-challenge.operations.services.interpreter :as interpreter]
                                                                 [com.server-truenorth-challenge.operations.repository :as operations-repository]))


(defn- handle-expression-type-of-operation [expression cost-and-id-by-operation user-id user-balance]
  (try
    (let [lexer (lexer/lexer expression cost-and-id-by-operation)
          {:keys [abstract-syntax-tree total-cost]} (parser/parse lexer)
          new-user-balance (- user-balance total-cost)
          does-user-have-enough-money? (>= new-user-balance 0)]
      (if does-user-have-enough-money?
        (try
          (let [{:keys [node amounts]} (interpreter/evaluate abstract-syntax-tree user-balance)
                _ (if (> (count amounts) 0) (operations-repository/records-bulk-insert user-id (reverse amounts)), nil)]
            {:is-valid true
             :reason nil
             :data {:result node
                    :balance new-user-balance}}) (catch Throwable e (if (-> e ex-data :error (= :invalid-syntax)) {:is-valid false
                                                                                                                   :reason :invalid-syntax
                                                                                                                   :data nil} (throw e))))
        {:is-valid false
         :reason :not-enough-money
         :data nil}))
    (catch Throwable e (if (-> e ex-data :error (= :invalid-syntax)) {:is-valid false
                                                                      :reason :invalid-syntax
                                                                      :data nil} (throw e)))))

(defn- handle-random-string-type-of-operation [cost-and-id-by-operation user-id user-balance]
  (try (let [data (-> "https://www.random.org/strings/?num=1&len=20&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new" slurp)
             new-user-balance (- user-balance (-> cost-and-id-by-operation :random_string :cost))]
         (if (>= new-user-balance 0)
           (let [_ (operations-repository/records-bulk-insert user-id [{:operation-type :random_string
                                                                        :operation-id (-> cost-and-id-by-operation :random_string :id)
                                                                        :amount (-> cost-and-id-by-operation :random_string :cost)
                                                                        :user-balance new-user-balance
                                                                        :result data}])]
             {:is-valid true
              :reason nil
              :data {:result data
                     :balance new-user-balance}})
           {:is-valid false
            :reason :not-enough-money
            :data nil}))
       (catch Throwable _
         {:is-valid false
          :reason :unreachable
          :data nil})))

(defn new-operation [operation-type expression user-id]
  (let [all-operations (operations-repository/operations-get-all)
        cost-and-id-by-operation (reduce (fn [result operation] (assoc result (keyword (:operations/type operation)) {:cost (float (:operations/cost operation))
                                                                                                                      :id (:operations/id operation)})) {} all-operations)
        previous-record (operations-repository/records-get-last-record-of-user user-id)
        user-balance (if (empty? previous-record) settings/default-user-balance (-> previous-record first :records/user_balance float))]
    (if (= operation-type "expression")
      (handle-expression-type-of-operation expression cost-and-id-by-operation user-id user-balance)
      (handle-random-string-type-of-operation cost-and-id-by-operation user-id user-balance))))


(defn get-all-operations
  "Returns a list of all of the operations available to be performed by the user"
  []
  (operations-repository/operations-get-all))