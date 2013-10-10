(ns ublt.conkeror.util)

;; TODO: This should probably be in xulrunner's namespace
(defn cc [id]
  (aget (.-classes js/Components) id))

(def conkeror
  (-> (cc "@conkeror.mozdev.org/application;1")
      (.getService) (.-wrappedJSObject)))

(defn require [module-name]
  (.require conkeror (name module-name)))

(defn add-hook [name f prepend?]
  (.add_hook conkeror f prepend?))

(defn content-window [I]
  (-> I (.-window)
      (.-buffers) (.-current)
      (.-browser)
      (.-contentWindow) (.-wrappedJSObject)))

(defn interactive [name desc f]
  (.interactive conkeror name desc f))

;; (defmacro call [f & args]
;;   `(js* ~(name f)))

;; (call :theme_load "ubolonton")
;; (call "theme_load" "ubolonton")
