require("ublt");

// Components.utils.import('resource://gre/modules/commonjs/toolkit/loader.js');
// Components.utils.import('jar:file:///home/ubolonton/Programming/Tools/xulrunner/omni.ja!/modules/commonjs/toolkit/loader.js');

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
    return new interactive_context(repl_context().buffer);
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

function minibuffer_set_cf(I, b) {
  I.window._minibuffer_complete_should_follow = b;
  I.minibuffer.element.setAttribute("followmode", b);
  var state = I.minibuffer.current_state;
  if (state && state.completions_display_element) {
    state.completions_display_element.setAttribute("followmode", b);
  }
}

interactive("switch-to-recent-buffer",
    "Prompt for a buffer and switch to it.",
    function (I) {
      I.window._last_buffer = I.buffer;
      // I.window._minibuffer_complete_should_follow = minibuffer_complete_should_follow;
      minibuffer_set_cf(I, minibuffer_complete_should_follow);
      var buffer = (yield I.minibuffer.read_recent_buffer(
        $prompt = "Switch to buffer (p):",
        $default = (I.window.buffers.count > 1 ?
                    I.window.buffers.buffer_history[1] :
                    I.buffer)));

      I.window._last_buffer = undefined;
      minibuffer_set_cf(I, undefined);
      switch_to_buffer(I.window, buffer);
    });

interactive("minibuffer-abort", null, function (I) {
  if (I.window._minibuffer_complete_should_follow) {
    minibuffer_set_cf(I, undefined);
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
  minibuffer_set_cf(I, !I.window._minibuffer_complete_should_follow);
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

// var sb = new Cu.Sandbox(w(), {
//   sandboxPrototype: w(),
//   wantXrays: false
// });

// function parse(string, type) {
//   return Cu.evalInSandbox("new DOMParser", sb).parseFromString(string, type || "text/xml");
// }

// var {Services: Services} = Cu.import("resource://gre/modules/Services.jsm", {});

// Cu.import("resource://gre/modules/FileUtils.jsm");
// FileUtils.File("/home/ubolonton/.conkerorrc/config/tmp.js");

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


// text_entry_minibuffer_state.prototype = {
//     constructor: text_entry_minibuffer_state,
//     __proto__: basic_minibuffer_state.prototype,
//     load: function () {
//         basic_minibuffer_state.prototype.load.call(this);
//         var window = this.minibuffer.window;
//         if (this.completer) {
//             // Create completion display element if needed
//             if (! this.completion_element) {
//                 /* FIXME: maybe use the dom_generator */
//                 var list = create_XUL(window, "richlistbox");
//                 // var tree = create_XUL(window, "tree");
//                 var s = this;
//                 list.addEventListener("select", function () {
//                   s.selected_completion_index = s.completions_display_element.selectedIndex;
//                   s.handle_completion_selected();
//                 }, true);
//                 list.setAttribute("class", "completions");

//                 // tree.setAttribute("rows", minibuffer_completion_rows);

//                 list.setAttribute("collapsed", "true");

//                 // tree.setAttribute("hidecolumnpicker", "true");
//                 // tree.setAttribute("hideheader", "true");
//                 // if (this.enable_icons)
//                 //     tree.setAttribute("hasicons", "true");

//                 // var treecols = create_XUL(window, "treecols");
//                 // tree.appendChild(treecols);
//                 // var treecol = create_XUL(window, "treecol");
//                 // treecol.setAttribute("flex", "1");
//                 // treecols.appendChild(treecol);
//                 // treecol = create_XUL(window, "treecol");
//                 // treecol.setAttribute("flex", "1");
//                 // treecols.appendChild(treecol);
//                 // tree.appendChild(create_XUL(window, "treechildren"));

//                 this.minibuffer.insert_before(list);
//                 // list.view = new completions_tree_view(this);
//                 this.completions_display_element = list;

//                 // This is the initial loading of this minibuffer state.
//                 // If this.auto_complete_initial is true, generate
//                 // completions.
//                 if (this.auto_complete_initial)
//                     this.handle_input();
//             }
//             this.update_completions_display();
//         }
//     },

//     unload: function () {
//         if (this.completions_display_element)
//             this.completions_display_element.setAttribute("collapsed", "true");
//         basic_minibuffer_state.prototype.unload.call(this);
//     },

//     destroy: function () {
//         if (this.completions != null && this.completions.destroy)
//             this.completions.destroy();
//         delete this.completions;
//         if (this.completions_cont)
//             this.completions_cont.throw(abort());
//         delete this.completions_cont;

//         var el = this.completions_display_element;
//         if (el) {
//             el.parentNode.removeChild(el);
//             this.completions_display_element = null;
//         }
//         if (this.continuation)
//             this.continuation.throw(abort());
//         basic_minibuffer_state.prototype.destroy.call(this);
//     },

//     handle_input: function () {
//         if (! this.completer)
//             return;
//         this.completions_valid = false;
//         if (! this.auto_complete)
//             return;
//         var s = this;
//         var window = this.minibuffer.window;
//         if (this.auto_complete_delay > 0) {
//             if (this.completions_timer_ID != null)
//                 window.clearTimeout(this.completions_timer_ID);
//             this.completions_timer_ID = window.setTimeout(
//                 function () {
//                     s.completions_timer_ID = null;
//                     s.update_completions(true /* auto */, true /* update completions display */);
//                 }, this.auto_complete_delay);
//             return;
//         }
//         s.update_completions(true /* auto */, true /* update completions display */);
//     },

//     update_completions_display: function () {
//         var m = this.minibuffer;
//         if (m.current_state == this) {
//             if (this.completions && this.completions.count > 0) {
//                 var e = this.completions_display_element;
//                 for (let i = e.children.length - 1; i >= 0; i--) {
//                     e.removeChild(e.children[i]);
//                 }
//                 var window = m.window;
//                 for (let i = 0; i < this.completions.count; i++) {
//                     var item = create_XUL(window, "richlistitem");
//                     e.appendChild(item);
//                 }

//                 // this.completions_display_element.view = this.completions_display_element.view;
//                 this.completions_display_element.setAttribute("collapsed", "false");
//                 this.completions_display_element.selectedIndex = this.selected_completion_index;
//                 var max_display = this.completions_display_element.getNumberofVisibleRows();
//                 var mid_point = Math.floor(max_display / 2);
//                 if (this.completions.count - this.selected_completion_index <= mid_point)
//                     var pos = this.completions.count - max_display;
//                 else
//                     pos = Math.max(0, this.selected_completion_index - mid_point);

//                 this.completions_display_element.scrollToIndex(pos);
//             } else {
//                 this.completions_display_element.setAttribute("collapsed", "true");
//             }
//         }
//     },

//     /* If auto is true, this update is due to auto completion, rather
//      * than specifically requested. */
//     update_completions: function (auto, update_display) {
//         var window = this.minibuffer.window;
//         if (this.completions_timer_ID != null) {
//             window.clearTimeout(this.completions_timer_ID);
//             this.completions_timer_ID = null;
//         }
//         var m = this.minibuffer;
//         if (this.completions_cont) {
//             this.completions_cont.throw(abort());
//             this.completions_cont = null;
//         }
//         let c = this.completer(m._input_text, m._selection_start,
//                                auto && this.auto_complete_conservative);
//         if (is_coroutine(c)) {
//             var s = this;
//             var already_done = false;
//             this.completions_cont = co_call(function () {
//                 try {
//                     var x = yield c;
//                 } catch (e) {
//                     handle_interactive_error(window, e);
//                 } finally {
//                     s.completions_cont = null;
//                     already_done = true;
//                 }
//                 s.update_completions_done(x, update_display);
//             }());
//             // In case the completer actually already finished
//             if (already_done)
//                 this.completions_cont = null;
//         } else
//             this.update_completions_done(c, update_display);
//     },

//     update_completions_done: function (c, update_display) {
//         /* The completer should return undefined if completion was not
//          * attempted due to auto being true.  Otherwise, it can return
//          * null to indicate no completions. */
//         if (this.completions != null && this.completions.destroy)
//             this.completions.destroy();

//         this.completions = c;
//         this.completions_valid = true;
//         this.applied_common_prefix = false;

//         if (c && ("get_match_required" in c))
//             this.match_required = c.get_match_required();
//         if (this.match_required == null)
//             this.match_required = this.match_required_default;

//         if (c && c.count > 0) {
//             var i = -1;
//             if (this.match_required) {
//                 if (c.count == 1)
//                     i = 0;
//                 else if (c.default_completion != null)
//                     i = c.default_completion;
//                 else if (this.default_completion && this.completions.index_of)
//                     i = this.completions.index_of(this.default_completion);
//             }
//             this.selected_completion_index = i;
//         }

//         if (update_display)
//             this.update_completions_display();
//     },

//     select_completion: function (i) {
//         this.selected_completion_index = i;
//         this.completions_display_element.currentIndex = i;
//         if (i >= 0)
//             this.completions_display_element.ensureIndexIsVisible(i);
//         this.handle_completion_selected();
//     },

//     handle_completion_selected: function () {
//         /**
//          * When a completion is selected, apply it to the input text
//          * if a match is not "required"; otherwise, the completion is
//          * only displayed.
//          */
//         var i = this.selected_completion_index;
//         var m = this.minibuffer;
//         var c = this.completions;

//         if (this.completions_valid && c && !this.match_required && i >= 0 && i < c.count)
//             m.set_input_state(c.get_input_state(i));
//     }
// };


provide("ublt-dev");
