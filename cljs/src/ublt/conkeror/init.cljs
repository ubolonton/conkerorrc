(ns ublt.conkeror.init
  ;; Yup, import not require because they write methods (using "this")
  ;; not functions
  (:import repl))

(.print repl "Initializing with cljs")
