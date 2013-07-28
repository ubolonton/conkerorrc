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

// // This doesn't work for some reason related to EXPORTED_SYMBOLS
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

function minibuffer_complete_follow(window, count) {
    minibuffer_complete(window, count);

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

    // if (s.history) {
    //     s.history.push(val);
    //     if (s.history.length > minibuffer_history_max_items)
    //         s.history.splice(0, s.history.length - minibuffer_history_max_items);
    // }

    // var cont = s.continuation;
    // // delete s.continuation;
    // // m.pop_state();
    // if (cont) {
    //     if (s.match_required)
    //         cont(match);
    //     else
    //         cont(val);
    // }
    // XXX
    if (match instanceof buffer) {
        switch_to_buffer(window, match);
    }
}

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
define_key(read_buffer_keymap, "C-M-t", "minibuffer-complete-follow");
define_key(read_buffer_keymap, "C-M-c",
           "minibuffer-complete-previous-follow");

add_hook("kill_buffer_hook", function(buffer) {
    DATA = buffer;
    buffer.dead = false;
    buffer.dead = true;
});

provide("ublt-dev");
