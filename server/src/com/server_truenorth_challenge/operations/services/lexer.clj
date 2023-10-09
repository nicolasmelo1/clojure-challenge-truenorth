(ns com.server-truenorth-challenge.operations.services.lexer)


(defn peek-next [expression next-position]
  (if (->> expression count (< next-position))
    (str (nth expression next-position))
    ""))

(defn- number
  "Square root and numbers are the only tokens that can be unary. This function will evaluate a number or a square root. It will return a map with the type, cost, total, value, and position of the token.\n
   Be aware: A number can have only one decimal point.

   ### Args:
   **:expression (str)**: The complete expression.\n
   **:costs (map)**: A map of the costs of each token.\n
   **:total (int)**: The total cost of the expression summed up from the previous tokens generated.\n
   **:start-position (int)**: Where to start retrieving the value\n
   **:value (str)**: The value of the token\n
   **:type (:number :square-root)**: The type of the token\n
   "
  [expression operation-id cost total start-position value type]
  (let [next-value (peek-next expression (+ start-position 1))
        has-decimal-point (> (count (re-seq #"and" value)) 0)]
    (cond
      (or (re-matches #"\d+" next-value) (= next-value ".")) (number expression operation-id cost total (+ start-position 1) (str value next-value) type)
      (> (count (re-seq #"and" value)) 1) (throw (ex-info "Invalid syntax" {:error :invalid-syntax :token nil}))
      :else {:type (if (= type :number) (if has-decimal-point :float :integer) type)
             :operation-id operation-id
             :cost cost
             :total total
             :value value
             :position (+ start-position 1)})))

(defn get-token
  "Get each token, one by one. It will return a map with the type, cost, total, value, and position of the token.\n
   We completely ignore spaces, and we will return the next token if we find one.\n

   ### Args:
   **:expression (str)**: The complete expression.\n
   **:costs (map)**: A map of the costs of each token.\n
   **:current-position (int)**: Where to start retrieving the value\n
   **:total (int)**: The total cost of the expression summed up from the previous tokens generated.\n"
  [expression costs current-position total]
  (if (->> expression count (< current-position))
    (let [value (str (nth expression current-position))]
      (cond
        (= value " ") (get-token expression costs (+ current-position 1) total)
        (= value "+") {:type :plus
                       :operation-id (-> costs :addition :id)
                       :cost (-> costs :addition :cost)
                       :total (+ (-> costs :addition :cost) total)
                       :value "+"
                       :position current-position}
        (= value "-") {:type :minus
                       :operation-id (-> costs :addition :id)
                       :cost (-> costs :subtraction :cost)
                       :total (+ (-> costs :subtraction :cost) total)
                       :value "-"
                       :position current-position}
        (= value "*") {:type :multiply
                       :operation-id (-> costs :multiplication :id)
                       :cost (-> costs :multiplication :cost)
                       :total (+ (-> costs :multiplication :cost) total)
                       :value "*"
                       :position current-position}
        (= value "/") {:type :divide
                       :operation-id (-> costs :division :id)
                       :cost (-> costs :division :cost)
                       :total (+ (-> costs :division :cost) total)
                       :value "/" :position current-position}
        (and (= value "|") (= (peek-next expression (+ current-position 1)) "/") (re-matches #"\d+" (peek-next expression (+ current-position 2))))
        (number expression (-> costs :square_root :id) (-> costs :square_root :cost) (+ (-> costs :square_root :cost) total) (+ current-position 1) "" :square-root)
        (= value "(") {:type :lparen :operation-id nil :cost 0 :total total :value "(" :position current-position}
        (= value ")") {:type :rparen :operation-id nil :cost 0 :total total :value ")" :position current-position}
        (re-matches #"\d+" value) (number expression nil 0 total current-position value :number)
        :else {:type :eof
               :operation-id nil
               :value value
               :cost 0
               :total total
               :position current-position}))
    {:type :eof
     :operation-id nil
     :value ""
     :cost 0
     :total total
     :position current-position}))

(defn- recursive-lexer-factory [expression costs & {:keys [current-position total] :or {current-position 0 total 0}}]
  (let [{:keys [type value cost operation-id total position]} (get-token expression costs current-position total)
        lexer {:current-position position
               :expression expression
               :total total
               :token {:type type
                       :cost cost
                       :operation-id operation-id
                       :value value}
               :get-next-token (fn []
                                 (recursive-lexer-factory expression
                                                          costs
                                                          {:current-position (+ position 1)
                                                           :total total}))}]
    lexer))

(defn lexer
  [expression costs]
  (recursive-lexer-factory expression costs {:current-position 0 :total 0})) 