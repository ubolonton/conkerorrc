require("ublt");


function m_class(el) {
  var cl = el.getAttribute("class");
  cl = cl ? cl.split(" ")[0] : "";
  return cl ? "." + cl : "";
}

function m_id(el) {
  var id = el.getAttribute("id");
  return id ? "#" + id : "";
}

function css_selector(el) {
  var e = el;
  var sel = [];
  while (e && e.tagName != "BODY") {
    sel.push(e.tagName.toLowerCase() + m_id(e) + m_class(e));
    e = e.parentElement;
  }
  return sel.reverse().join(" ");
}

function pp(obj, all) {
  var l = [];
  for (var p in obj)
    if (all || Object.hasOwnProperty.call(obj, p))
      l.push(p + ": " + obj[p]);
  return l.join("\n");
}

function pl(obj, all) {
  var l = [];
  for (var p in obj)
    if (all || Object.hasOwnProperty.call(obj, p))
      l.push(p);
  return l.join("\n");
}

function pc(obj, all) {
  var count = 0;
  for (var p in obj)
    if (all || Object.hasOwnProperty.call(obj, p))
      count ++;
  return count;
}

function contentW() {
  return repl_context().window.buffers.current.browser.contentWindow;
}

function w() {
    return repl_context().window;
}

// // This doesn't work for some reason related to EXPORTED_SYMBOLS.
// // Maybe it's just for .jsm files?
// let (require = function(module) {
//     var temp = {
//         require: require,
//         exports: {},
//     };
//     Components.utils.import(module, temp);
//     return temp.exports;
// }) {
//     ublt.ns("ublt.commonjs", {
//         require: require
//     });
// };

function getServices() {
  var scope = {};
  Components.utils.import("resource://gre/modules/Services.jsm", scope);
  return scope.Services;
}

// CommonJS-style loader. Copied & modified from Erik Vold <erikvvold@gmail.com>
// TODO: How about versioning?
function makeLoader() {
  var modules = {};
  var {io, scriptloader} = getServices();

  // TODO: Find a sensible way to separate searching and loading
  var base = io.newURI("file:///home/ubolonton/.conkerorrc/node_modules/", null, null);

  var require = function(src) {
    if (modules[src])
      return modules[src];

    // Prepare a scope with only require function and empty exports
    var scope = {
      require: require,
      exports: {}
    };

    // TODO: Move the export strategy out
    var uri = io.newURI(src + "/" + src + ".js", null, base);
    // Load source into scope
    scriptloader.loadSubScript(uri.spec, scope);
    // Expose exports from loaded module
    modules[src] = scope.exports;

    return modules[src];
  };

  return {
    require: require,
    modules: modules
  };
}

/* Imports a commonjs style javascript file with loadSubScrpt
 * By Erik Vold <erikvvold@gmail.com> http://erikvold.com/
 *
 * @param src (String)
 * The url of a javascript file.
 */
(function(global) {
    var modules = {};
    global.require = function require(src) {
        if (modules[src]) return modules[src];
        var scope = {require: global.require, exports: {}};
        var tools = {};
        Components.utils.import("resource://gre/modules/Services.jsm", tools);
        var baseURI = tools.Services.io.newURI(__SCRIPT_URI_SPEC__, null, null);
        try {
            var uri = tools.Services.io.newURI(
                "packages/" + src + ".js", null, baseURI);
            tools.Services.scriptloader.loadSubScript(uri.spec, scope);
        } catch (e) {
            var uri = tools.Services.io.newURI(src, null, baseURI);
            tools.Services.scriptloader.loadSubScript(uri.spec, scope);
        }
        return modules[src] = scope.exports;
    };
})// (this)
;

function makeI() {
    return new interactive_context(repl_context().window);
}

// 
// This section is full of epic HACKs

// This is a modified copy of exit_minibuffer
function minibuffer_complete_follow(window, count) {
    minibuffer_complete(window, count);
    if (!window._minibuffer_complete_should_follow) {
      return;
    }

    var m = window.minibuffer;
    var s = m.current_state;
    if (! (s instanceof text_entry_minibuffer_state))
        throw new Error("Invalid minibuffer state");

    var val = m._input_text;

    if (s.validator != null && ! s.validator(val, m))
        return;

    var match = null;

    if (s.completer && s.match_required) {
        if (! s.completions_valid || s.completions === undefined)
            s.update_completions(false /* not conservative */, false /* don't update */);

        let c = s.completions;
        let i = s.selected_completion_index;
        if (c != null && i >= 0 && i < c.count) {
            if (c.get_value != null)
                match = c.get_value(i);
            else
                match = c.get_string(i);
        } else {
            m.message("No match");
            return;
        }
    }

  if (match instanceof buffer) {
    switch_to_buffer(window, match);
  } else {
    if (s.history) {
      s.history.push(val);
      if (s.history.length > minibuffer_history_max_items)
        s.history.splice(0, s.history.length - minibuffer_history_max_items);
    }

    var cont = s.continuation;
    delete s.continuation;
    m.pop_state();
    if (cont) {
      if (s.match_required)
        cont(match);
      else
        cont(val);
    }
  }
}

define_variable(
  "minibuffer_complete_should_follow",
  false,
  "Whether to auto-preview on switching buffer");

interactive(
    "minibuffer-complete-follow", null,
    function(I) {
        minibuffer_complete_follow(I.window, I.p);
    });
interactive(
    "minibuffer-complete-previous-follow", null,
    function(I) {
        minibuffer_complete_follow(I.window, -I.p);
    });
// define_key(read_buffer_keymap, "C-M-t", "minibuffer-complete-follow");
// define_key(read_buffer_keymap, "C-M-c", "minibuffer-complete-previous-follow");

define_key(read_buffer_keymap, "down", "minibuffer-complete-follow");
define_key(read_buffer_keymap, "up", "minibuffer-complete-previous-follow");

interactive("switch-to-recent-buffer",
    "Prompt for a buffer and switch to it.",
    function (I) {
      I.window._last_buffer = I.buffer;
      I.window._minibuffer_complete_should_follow = minibuffer_complete_should_follow;
      var buffer = (yield I.minibuffer.read_recent_buffer(
        $prompt = "Switch to buffer (p):",
        $default = (I.window.buffers.count > 1 ?
                    I.window.buffers.buffer_history[1] :
                    I.buffer)));

      I.window._last_buffer = undefined;
      I.window._minibuffer_complete_should_follow = undefined;
      switch_to_buffer(I.window, buffer);
    });

interactive("minibuffer-abort", null, function (I) {
  if (I.window._minibuffer_complete_should_follow) {
    I.window._minibuffer_complete_should_follow = undefined;
  }
  if (I.window._last_buffer)  {
    var last_buffer = I.window._last_buffer;
    I.window._last_buffer = undefined;
    switch_to_buffer(I.window, last_buffer);
    minibuffer_abort(I.window);
  } else  {
    minibuffer_abort(I.window);
  }
});

interactive("minibuffer-toggle-complete-follow", null, function(I) {
  I.window._minibuffer_complete_should_follow = !I.window.minibuffer_complete_should_follow;
});

// define_key(read_buffer_keymap, "C-c C-f", "minibuffer-toggle-complete-follow");
define_key(read_buffer_keymap, "s-f", "minibuffer-toggle-complete-follow");

// 

// add_hook("kill_buffer_hook", function(buffer) {
//     DATA = buffer;
//     buffer.dead = false;
//     buffer.dead = true;
// });

var {classes: Cc, Constructor: CC, interfaces: Ci, utils: Cu,
     results: Cr, manager: Cm } = Components;

var sb = new Cu.Sandbox(w(), {
  sandboxPrototype: w(),
  wantXrays: false
});

function parse(string, type) {
  return Cu.evalInSandbox("new DOMParser", sb).parseFromString(string, type || "text/xml");
}

var {Services: Services} = Cu.import("resource://gre/modules/Services.jsm", {});

Cu.import("resource://gre/modules/FileUtils.jsm");
FileUtils.File("/home/ubolonton/.conkerorrc/config/tmp.js");

function readFile(file) {
  var data = "";
  var fstream = Cc["@mozilla.org/network/file-input-stream;1"].
        createInstance(Components.interfaces.nsIFileInputStream);
  var cstream = Cc["@mozilla.org/intl/converter-input-stream;1"].
        createInstance(Ci.nsIConverterInputStream);
  fstream.init(file, -1, 0, 0);
  cstream.init(fstream, "UTF-8", 0, 0); // you can use another encoding here if you wish

  let (str = {}) {
    let read = 0;
    do {
      read = cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value
      data += str.value;
    } while (read != 0);
  };
  cstream.close(); // this closes fstream
  return data;
}

// var {Loader, Require, Unload} = Cu.import("resource:///modules/sdk/loader.js");



provide("ublt-dev");
