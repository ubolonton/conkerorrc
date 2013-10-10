(defproject cljs-conkeror-config "0.1.0-SNAPSHOT"
  :description "Ù Bo Lon Ton's Conkeror config in ClojureScript"
  :url "http://github.com/ubolonton/conkerorrc"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/clojurescript "0.0-1896"]]
  ;; :source-paths ["src-clj"]
  :cljsbuild
  {:builds
   [{:source-paths ["src"]
     :compiler {:output-dir "build"
                :optimizations :none
                :pretty-print true
                :output-to "deps.js"}}]})
