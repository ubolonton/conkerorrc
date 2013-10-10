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

  // pr_str: function(data) {
  //   return this.env.cljs.core.pr_str(data);
  // },

  // keyword: function(str) {
  //   return this.env.cljs.core.keyword(str);
  // },

  handleInput: function(repl, input) {
    dumpln("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    dumpln(input);
    var result;
    var c = this.env.cljs.core;
    var k = function(str) {
      return c.keyword(str);
    };
    var m = c.js__GT_clj({});
    try {
      result = c.assoc(m, k("status"), k("success"));
      result = c.assoc(result, k("value"), repl.evaluate(input, this.env));
      // result = {
      //   status: k("success"),
      //   value: c.pr_str()
      // };
    } catch (e) {
      result = c.assoc(m, k("status"), k("exception"));
      result = c.assoc(result, k("value"), c.pr_str(e));
      result = c.assoc(result, k("stacktrace"), e.hasOwnProperty("stack") ? e.stack : "No stacktrace available.");
      // result = {
      //   status: k("exception"),
      //   value: c.pr_str(e),
      //   stack: e.hasOwnProperty("stack") ? e.stack : "No stacktrace available."
      // };
    }
    dumpln("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    dumpln(result);
    var rep = c.pr_str(result);
    dumpln("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    dumpln(rep);
    repl.print(rep);
    repl._prompt();
  }
};

repl.defineInteractor("cljs", cljs_mozrepl_interactor);

repl.pushInteractor("cljs");

provide("ublt-cljs-mozrepl");
