(ns com.server-truenorth-challenge.operations.services.parser)

(defn factor [{:keys [token] :as lexer}]
  (cond
    (= (:type token) :integer) {:lexer ((:get-next-token lexer))
                                :node token}
    (= (:type token) :float) {:lexer ((:get-next-token lexer))
                              :node token}
    (= (:type token) :lparen) (let [next-lexer ((:get-next-token lexer))
                                    {:keys [lexer node]} ((resolve 'com.server-truenorth-challenge.interpreter.parser/expression) next-lexer)
                                    r-paren-token-lexer ((:get-next-token lexer))]
                                {:lexer ((:get-next-token r-paren-token-lexer))
                                 :node node})
    (= (:type token) :square-root) {:lexer ((:get-next-token lexer))
                                    :node token}
    :else (throw (ex-info "Invalid syntax" {:error :invalid-syntax :token token}))))

(defn term [initial-lexer]
  (let [{:keys [lexer node] :as lexer-and-node} (factor initial-lexer)
        token (:token lexer)
        next-lexer ((:get-next-token lexer))]
    (cond
      (= (:type token) :multiply) (let [term-lexer (term next-lexer)]
                                    {:lexer (:lexer term-lexer)
                                     :node {:type :multiply
                                            :cost (:cost token)
                                            :operation-id (:operation-id token)
                                            :left node
                                            :right (:node term-lexer)}})
      (= (:type token) :divide) (let [term-lexer (term next-lexer)]
                                  {:lexer (:lexer term-lexer)
                                   :node {:type :divide
                                          :cost (:cost token)
                                          :operation-id (:operation-id token)
                                          :left node
                                          :right (:node term-lexer)}})
      :else lexer-and-node)))

(defn expression [initial-lexer]
  (let [{:keys [lexer node] :as lexer-and-node} (term initial-lexer)
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

(defn parse [lexer]
  (let [last-node (program lexer)]
    {:total-cost (:total (:lexer last-node))
     :abstract-syntax-tree (:node last-node)}))