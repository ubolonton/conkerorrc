var {classes: Cc, Constructor: CC, interfaces: Ci, utils: Cu,
     results: Cr, manager: Cm } = Components;

// EXPORTED_SYMBOLS problem, so Cu.import is a no no

// TODO: Is this the best way to load script?
function loadScript(url, context) {
  var scope = {};
  Cu.import("resource://gre/modules/Services.jsm", scope);
  var {Services} = scope;
  Services.scriptloader.loadSubScript(url, context);
}

function makeEnv(baseURL) {
  // TODO: Do we really need a system principal?
  var principal = CC("@mozilla.org/systemprincipal;1", "nsIPrincipal")();
  return new Cu.Sandbox(principal, {
    sandboxPrototype: {
      CLOSURE_BASE_PATH: baseURL
    },
    // TODO: Do we need really this?
    wantXrays: false
  });
}

function googURL(module, env) {
  if (!env.CLOSURE_BASE_PATH) {
    throw Error("CLOSURE_BASE_PATH not set");
  }
  return env.CLOSURE_BASE_PATH + module + ".js";
}

function setUp(env) {
  // src is a URL
  env.CLOSURE_IMPORT_SCRIPT = function(src) {
    loadScript(src, env);
  };
  loadScript(googURL("base", env), env);
  // TODO: Maybe this should be optional?
  loadScript(googURL("deps", env), env);
}

var cljs_env = makeEnv("file:///home/ubolonton/Programming/Clojure/lib/clojurescript/closure/library/closure/goog/");

provide("ublt-cljs");
