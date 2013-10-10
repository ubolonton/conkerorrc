(ns ublt.conkeror.readability
  (:require [ublt.conkeror.util :as u]))

(def *token* "u3UkrgRbELzG4mM5CGBEnu2qLMVC8JNnxXd76Mtc")

(defn merge! [obj map]
  (doseq [[k v] map]
    (aset obj (str k) v))
  obj)

(defn element! [doc tag props]
  (let [e (.createElement doc tag)]
    (doseq [[k v] props]
      (.setAttribute e (str k) v))
    e))

(defn read-now [I]
  (let [window (u/content-window I)
        document (.-document window)]
    (merge! window
            {:baseUrl "http://www.readability.com"
             :readabilityToken *token*})
    (.appendChild (.-documentElement document)
                  (element! document "script"
                            {:type "text/javascript"
                             :charset "UTF-8"
                             :src (str (.-baseUrl "/bookmarklet/read.js"))}))))


;; (.interactive conkeror "readability-read-now" "" read-now)
