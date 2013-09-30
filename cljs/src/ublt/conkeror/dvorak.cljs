(ns ublt.conkeror.dvorak
  (:require [conkeror :as c]))

(.require c/conkeror "keymap")
(.require c/conkeror "global-overlay-keymap")

(defn aliases [pairs]
  (doseq [[from to] pairs]
    (c/define_key_alias (str from) (str to))))

(set-print-fn! (fn [s] (.print c/repl s)))

;; (defn test []
;;   (js/yield 1))

(defn test [v]
  (js* "yield " v))

;; (println "Here")

(aliases
 {
  :s-c :M-x
  })
