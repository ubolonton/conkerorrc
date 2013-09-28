var {classes: Cc, Constructor: CC, interfaces: Ci, utils: Cu,
     results: Cr, manager: Cm } = Components;

// Note that goog.dependencies_.written in our context means "loaded" instead

// EXPORTED_SYMBOLS problem, so Cu.import is a no no


// TODO: Is this the best way to load script?
function loadScript(url, context) {
  var scope = {};
  Cu.import("resource://gre/modules/Services.jsm", scope);
  var {Services} = scope;
  Services.scriptloader.loadSubScript(url, context);
}

function goog_make_env(baseURL) {
  // TODO: Do we really need a system principal?
  var principal = CC("@mozilla.org/systemprincipal;1", "nsIPrincipal")();
  // TODO: And do we really need a sandbox?
  return new Cu.Sandbox(principal, {
    sandboxPrototype: {
      CLOSURE_BASE_PATH: baseURL
    },
    // TODO: Do we need really this?
    wantXrays: false
  });
}


function goog_url(module, env) {
  if (!env.CLOSURE_BASE_PATH) {
    throw Error("CLOSURE_BASE_PATH not set");
  }
  return env.CLOSURE_BASE_PATH + module + ".js";
}


function goog_set_up(env) {
  // src is a URL
  env.CLOSURE_IMPORT_SCRIPT = function(src) {
    // TODO: How do we handle possible errors here?
    loadScript(src, env);
    return true;
  };
  loadScript(goog_url("base", env), env);
  // TODO: Maybe this should be optional?
  loadScript(goog_url("deps", env), env);
}


// deps is a list of [file, provides, requires]
// additions is additional ns => module mapping for modules loaded outside
function goog_new_env(baseURL, deps, additions) {
  var cljs = goog_make_env(baseURL);
  goog_set_up(cljs);
  deps.forEach(function(dep) {
    let [file, provides, requires] = dep;
    cljs.goog.addDependency(file, provides, requires);
  });
  for (var ns in additions) {
    let module = additions[ns];
    cljs.goog.provide(ns);
    cljs[ns] = module;
  }
  return cljs;
}


var cljs = goog_new_env(
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


provide("ublt-cljs");
