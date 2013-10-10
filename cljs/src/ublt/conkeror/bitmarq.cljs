(ns ublt.conkeror.bitmarq
  (:require [ublt.conkeror.util :as u]))

(def base "https://staging.bitmarq.com/")

(defn read [I]
  (let [window (u/content-window I)
        url (.-location window)]
    (aset window "location" (str base url))))

(u/interactive "read-on-bitmarq" "" read)
