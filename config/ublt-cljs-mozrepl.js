// Piggyback on mozrepl for a clojurescript REPL. Note that
// cljs-to-js compilation is done by the client, who then sends js to
// mozrepl server

require("ublt-cljs");

var cljs_mozrepl_interactor = {
  onStart: function(repl) {
    var Cc = Components.classes;
    this.env = goog_new_env(
      "file:///home/ubolonton/Programming/Clojure/lib/clojurescript/closure/library/closure/goog/",
      // XXX: Google Closure doesn't seem to support a list of search paths
      // For (require '[cljs.core])
      [["../../../../out/cljs/core.js", ["cljs.core"],
        ["goog.string", "goog.string.StringBuffer",
         "goog.object", "goog.array"]]], {
           repl: repl,
           // For (require '[conkeror])
           conkeror: Cc["@conkeror.mozdev.org/application;1"].getService().wrappedJSObject
         });
    this.env.goog.require("cljs.core");
  },

  onStop: function(repl) {},

  onSuspend: function(repl) {},

  onResume: function(repl) {},

  getPrompt: function(repl) {
    return "";
  },

  pr_str: function(data) {
    return this.env.cljs.core.pr_str(data);
  },

  handleInput: function(repl, input) {
    repl.debug("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    repl.debug(input);
    var result;
    try {
      result = {
        status: "success",
        value: this.pr_str(repl.evaluate(input, this.env))
      };
    } catch (e) {
      result = {
        status: "exception",
        value: this.pr_str(e),
        stack: e.hasOwnProperty("stack") ? e.stack : "No stacktrace available."
      };
    }
    repl.debug("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    repl.debug(result);
    var rep = repl.represent(result);
    repl.debug("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    repl.debug(rep);
    repl.print(rep);
    repl._prompt();
  }
};

repl.defineInteractor("cljs", cljs_mozrepl_interactor);

repl.pushInteractor("cljs");

provide("ublt-cljs-mozrepl");
