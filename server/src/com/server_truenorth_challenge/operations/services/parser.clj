(ns com.server-truenorth-challenge.operations.services.parser)

(defn factor [{:keys [token] :as lexer} term expression]
  (cond
    (= (:type token) :integer) {:lexer ((:get-next-token lexer))
                                :node token}
    (= (:type token) :float) {:lexer ((:get-next-token lexer))
                              :node token}
    (= (:type token) :minus) (let [next-lexer ((:get-next-token lexer))
                                   {:keys [lexer node]} (factor next-lexer term expression)]
                               {:lexer lexer
                                :node {:type :unary-minus
                                       :cost 0
                                       :operation-id nil
                                       :token node
                                       :operation token}})
    (= (:type token) :plus) (let [next-lexer ((:get-next-token lexer))
                                  {:keys [lexer node]} (factor next-lexer term expression)]
                              {:lexer lexer
                               :node {:type :unary-plus
                                      :cost 0
                                      :operation-id nil
                                      :token node
                                      :operation token}})
    (= (:type token) :lparen) (let [next-lexer ((:get-next-token lexer))
                                    {:keys [lexer node]} (expression next-lexer)
                                    r-paren-token-lexer ((:get-next-token lexer))]

                                {:lexer ((:get-next-token r-paren-token-lexer))
                                 :node node})
    (= (:type token) :square-root) {:lexer ((:get-next-token lexer))
                                    :node token}
    :else (throw (ex-info "Invalid syntax" {:error :invalid-syntax :token token}))))

(defn term [initial-lexer expression]
  (let [{:keys [lexer node] :as lexer-and-node} (factor initial-lexer term expression)
        token (:token lexer)
        next-lexer ((:get-next-token lexer))]
    (cond
      (= (:type token) :multiply) (let [term-lexer (term next-lexer expression)]
                                    {:lexer (:lexer term-lexer)
                                     :node {:type :multiply
                                            :cost (:cost token)
                                            :operation-id (:operation-id token)
                                            :left node
                                            :right (:node term-lexer)}})
      (= (:type token) :divide) (let [term-lexer (term next-lexer expression)]
                                  {:lexer (:lexer term-lexer)
                                   :node {:type :divide
                                          :cost (:cost token)
                                          :operation-id (:operation-id token)
                                          :left node
                                          :right (:node term-lexer)}})
      :else lexer-and-node)))

(defn expression [initial-lexer]
  (let [{:keys [lexer node] :as lexer-and-node} (term initial-lexer expression)
        token (:token lexer)
        next-lexer ((:get-next-token lexer))]
    (cond
      (= (:type token) :plus) (let [term-lexer (expression next-lexer)]
                                {:lexer (:lexer term-lexer)
                                 :node {:type :plus
                                        :cost (:cost token)
                                        :operation-id (:operation-id token)
                                        :left node
                                        :right (:node term-lexer)}})
      (= (:type token) :minus) (let [term-lexer (expression next-lexer)]
                                 {:lexer (:lexer term-lexer)
                                  :node {:type :minus
                                         :cost (:cost token)
                                         :operation-id (:operation-id token)
                                         :left node
                                         :right (:node term-lexer)}})
      :else lexer-and-node)))

(defn- program [initial-lexer]
  (let [{:keys [lexer node]} (expression initial-lexer)
        next-lexer ((:get-next-token lexer))] {:lexer next-lexer
                                               :node node}))

(defn parse
  "Create an abstract syntax tree from the lexer, we use the data from the costs alongside it to calculate the total cost
   This will update all of the records so for example, if you have a deeply nested expression, with lots of operations we will
   guarantee to update each one of them in the database.
     
   Each node MUST contain the following keys: :cost and :operation-id, the rest of the keys are optional and depend on the type of node. For Binary Operation
   nodes we will have the following keys: :left, :right, :type. For Factors we return the node as the token."
  [lexer]
  (let [last-node (program lexer)]
    {:total-cost (:total (:lexer last-node))
     :abstract-syntax-tree (:node last-node)}))