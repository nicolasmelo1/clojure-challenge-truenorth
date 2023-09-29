(ns com.server-truenorth-challenge.operations.schemas)

(def new-operation-body
  [:map
   [:operation [:enum "addition", "subtraction", "multiplication", "division", "square_root", "random_string"]]])