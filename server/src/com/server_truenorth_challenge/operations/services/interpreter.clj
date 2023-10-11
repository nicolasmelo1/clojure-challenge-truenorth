(ns com.server-truenorth-challenge.operations.services.interpreter)

(defn- visit-binary-operations
  [{:keys [node amounts user-balance]} operation operation-type visit]
  (let [new-user-balance (- user-balance (:cost node))
        left-node {:node (-> node :left)
                   :amounts amounts
                   :user-balance new-user-balance}
        right-node {:node (-> node :right)
                    :amounts amounts
                    :user-balance (:user-balance left-node)}
        result-of-left-node (visit left-node)
        result-of-right-node (visit right-node)
        result (operation (:node result-of-left-node) (:node result-of-right-node))]
    {:node result
     :amounts (concat amounts (:amounts result-of-left-node) (:amounts result-of-right-node) [{:operation-type operation-type
                                                                                               :operation-id (:operation-id node)
                                                                                               :user-balance new-user-balance
                                                                                               :amount (:cost node)
                                                                                               :result result}])
     :user-balance new-user-balance}))

(defn- visit-square-root
  "Square root is a unary operation, so we only need to visit the left node. I wanted to make it an expression, but, for the sake of this test, decided to keep it simple.
   
   ### Args:
   ** :node-amounts-and-user-balance (map) **: A map with the node, the amounts and the user balance. Node is the actual node, or the value of an expression.
   Amounts is a vector so we can keep track of all of the operations we should charge, how much we should charge and how it'll change the user balance. Last but not
   least, the result of each operation, so we can keep track of each operation that was made.\n"
  [{:keys [node amounts user-balance]}]
  (let [new-user-balance (- user-balance (:cost node))
        result (-> node :value Float/parseFloat Math/sqrt)]
    {:node result
     :amounts (conj amounts {:operation-type :division
                             :operation-id (:operation-id node)
                             :amount (:cost node)
                             :user-balance new-user-balance
                             :result result})
     :user-balance new-user-balance}))

(defn visit
  "This will visit each node recursively and will evaluate the expression based on the abstract syntax tree.
   It will also keep track of the amounts and the user balance for each operation performed this way we can add the data correctly to the database
   and we can also return the amounts and the user balance to the client so that it can be displayed in the UI
   
   ### Args:
   ** :node-amounts-and-user-balance (map) **: A map with the node, the amounts and the user balance. Node is the actual node, or the value of an expression.
   Amounts is a vector so we can keep track of all of the operations we should charge, how much we should charge and how it'll change the user balance. Last but not
   least, the result of each operation, so we can keep track of each operation that was made.\n
   "
  [{:keys [node amounts user-balance] :as node-amounts-and-user-balance}]

  (cond
    (= (:type node) :integer) {:node (Float/parseFloat (:value node))
                               :amounts amounts
                               :user-balance user-balance}
    (= (:type node) :float) {:node (Float/parseFloat (:value node))
                             :amounts amounts
                             :user-balance user-balance}
    (= (:type node) :unary-minus) {:node (- (-> {:node (:token node)
                                                 :amount amounts
                                                 :user-balance user-balance} visit :node))
                                   :amounts amounts
                                   :user-balance user-balance}
    (= (:type node) :unary-plus) {:node (+ (-> {:node (:token node)
                                                :amount amounts
                                                :user-balance user-balance} visit :node))
                                  :amounts amounts
                                  :user-balance user-balance}
    (= (:type node) :plus) (visit-binary-operations node-amounts-and-user-balance + :addition visit)
    (= (:type node) :minus) (visit-binary-operations node-amounts-and-user-balance - :subtraction visit)
    (= (:type node) :multiply) (visit-binary-operations node-amounts-and-user-balance * :multiplication visit)
    (= (:type node) :divide)  (visit-binary-operations node-amounts-and-user-balance / :division visit)
    (= (:type node) :square-root) (visit-square-root node-amounts-and-user-balance)
    :else (throw (ex-info "Invalid syntax" {:error :invalid-syntax}))))

(defn evaluate [abstract-syntax-tree user-balance]
  (visit {:node abstract-syntax-tree
          :amounts []
          :user-balance user-balance}))