(ns ublt.conkeror.dvorak
  (:require [ublt.conkeror.util :as u]))

(u/require :keymap)
(u/require :global-overlay-keymap)

(defn aliases [pairs]
  (doseq [[from to] pairs]
    (u/define_key_alias (str from) (str to))))

;; (set-print-fn! (fn [s] (.print u/repl s)))

;; (defn test []
;;   (js/yield 1))

;; (defn test [v]
;;   (js* "yield " v))

;; (println "Here")

(aliases
 {
  :s-c :M-x
  })
