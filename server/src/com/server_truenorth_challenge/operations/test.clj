(ns com.server-truenorth-challenge.operations.test
  (:require
   [com.server-truenorth-challenge.operations.services.lexer :as lexer]
   [com.server-truenorth-challenge.operations.services.parser :as parser]
   [com.server-truenorth-challenge.operations.services.interpreter :as interpreter]
   [com.server-truenorth-challenge.operations.services.services :as operations-services]
   [clojure.test :as test]))

(def costs {:addition {:cost 0.33493, :id 1}
            :subtraction {:cost 0.18345, :id 2}
            :multiplication {:cost 0.77676, :id 3}
            :division {:cost 0.02397, :id 4}
            :square_root {:cost 0.20082, :id 5}
            :random_string {:cost 0.33605, :id 6}})

(test/deftest simple-interpreter-parser-and-lexer-test
  (let [lexer (lexer/lexer "1 + 1" costs)
        {:keys [abstract-syntax-tree total-cost]} (parser/parse lexer)
        {:keys [node amounts]} (interpreter/evaluate abstract-syntax-tree 100)]
    (test/is (= 2.0 node))
    (test/is (= 0.33493 total-cost))
    (test/is (= (-> amounts first :user-balance) 99.66507))))

(test/deftest complex-interpreter-parser-and-lexer-test
  (let [lexer (lexer/lexer "2 + (3 * 6)" costs)
        {:keys [abstract-syntax-tree total-cost]} (parser/parse lexer)
        {:keys [node amounts]} (interpreter/evaluate abstract-syntax-tree 100)]
    (test/is (= 20.0 node))
    (test/is (= 1.11169 total-cost))
    (test/is (= (count amounts) 2))
    (test/is (= (-> amounts first :user-balance) 98.88831))
    (test/is (= (-> amounts second :user-balance) 99.66507))))

(test/deftest square-root
  (let [lexer (lexer/lexer "|/25" costs)
        {:keys [abstract-syntax-tree total-cost]} (parser/parse lexer)
        {:keys [node]} (interpreter/evaluate abstract-syntax-tree 100)]
    (test/is (= 5.0 node))
    (test/is (= 0.20082 total-cost))))

(test/deftest unary-minus
  (let [lexer (lexer/lexer "-3 * 6" costs)
        {:keys [abstract-syntax-tree]} (parser/parse lexer)
        {:keys [node]} (interpreter/evaluate abstract-syntax-tree 100)]
    (test/is (= -18.0 node))))

(test/deftest division
  (let [lexer (lexer/lexer "6 / 2" costs)
        {:keys [abstract-syntax-tree]} (parser/parse lexer)
        {:keys [node]} (interpreter/evaluate abstract-syntax-tree 100)]
    (test/is (= 3.0 node))))

(defn new-operations [database user-id]
  (let [random-string-callback (fn [] "random-string")
        operations [{:operation-type "expression"
                     :expression "1 + 1"}
                    {:operation-type "expression"
                     :expression  "2 * 2 + 3"}
                    {:operation-type "expression"
                     :expression "4 * 4"}
                    {:operation-type "expression"
                     :expression "4 +"}
                    {:operation-type "expression"
                     :expression "4/2"}
                    {:operation-type "random-string"
                     :expression nil}]
        results (map #(operations-services/new-operation database (:operation-type %) (:expression %) user-id random-string-callback) operations)
        formatted-results (into [] results)]
    [(test/deftest new-operations-test
       (simple-interpreter-parser-and-lexer-test)
       (complex-interpreter-parser-and-lexer-test)
       (square-root)
       (unary-minus)
       (division)
       (test/is (= (-> formatted-results first :is-valid) true))
       (test/is (= (-> formatted-results first :data :result) 2.0))
       (test/is (= (-> formatted-results second :is-valid) true))
       (test/is (= (-> formatted-results second :data :result) 7.0))
       (test/is (= (-> formatted-results (nth 3) :is-valid) false))
       (test/is (= (-> formatted-results (nth 3) :reason) :invalid-syntax))
       (test/is (= (count formatted-results) 6)))
     formatted-results]))