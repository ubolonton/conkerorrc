(ns ublt.conkeror.repl
  (:require [clojure.browser.repl :as repl]))

(defn connect [port]
  (repl/connect (str "http://localhost:" port "/repl")))
