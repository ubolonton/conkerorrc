// OSX mapping: Command => A | Option => M
modifiers.M = new modifier(function (event) { return event.altKey; },
                           function (event) { event.altKey = true; });
modifiers.A = new modifier(function (event) { return event.metaKey; },
                           function (event) { event.metaKey = true; });

// Some useful modules
require("mode-line.js");
require("new-tabs.js");
require("daemon.js");
require("session.js");
require("dom-inspector.js");

// Textmate as external editor
editor_shell_command = "mate -w";

// Personal theme
theme_load_paths.unshift("/Users/ubolonton/.conkerorrc/themes/");
theme_unload("default");
theme_load("ubolonton");
interactive("ubolonton-theme", "Load my personal theme", 
            function(I) {
              theme_load("ubolonton");
            });
define_key(default_global_keymap, "A-u", "ubolonton-theme");

// gmail-mode
require("page-modes/gmail.js");
define_key(gmail_keymap, "v", null, $fallthrough);

// Does not seem to work :-(
user_pref("signon.prefillForms", true);
user_pref("signon.autofillForms", true);
user_pref("signon.rememberSignons", true);

// Custom key-bindings
define_key(content_buffer_normal_keymap, "M-f", "follow-new-buffer-background");
define_key(content_buffer_normal_keymap, "A-[", "back");
define_key(content_buffer_normal_keymap, "A-]", "forward");
define_key(default_global_keymap, "A-{", "buffer-previous");
define_key(default_global_keymap, "A-}", "buffer-next");
define_key(default_global_keymap, "A--", "zoom-out-full");
define_key(default_global_keymap, "A-t", "find-url-new-buffer");

// caret-mode by default
user_pref('accessibility.browsewithcaret', false);

// Some webjumps
define_webjump("bookmark",
               function(term) {return term;},
               $completer = history_completer($use_history = false,
                                              $use_bookmarks = true,
                                              $match_required = true),
               $description = "Visit a conkeror bookmark");
define_webjump("duckduckgo", "http://duckduckgo.com/?q=%s");

// Use history not bookmark?
url_completion_use_history = true;

// XKCD
xkcd_add_title = true;

// Download in background
download_buffer_automatic_open_target = OPEN_NEW_BUFFER_BACKGROUND;

// Load clicked link in background
require("clicks-in-new-buffer.js");
clicks_in_new_buffer_target = OPEN_NEW_BUFFER_BACKGROUND;

// MozRepl (4242)
user_pref('extensions.mozrepl.autoStart', true);
user_pref('extensions.mozrepl.loopbackOnly', false);
let (mozrepl_init = get_home_directory()) {
  mozrepl_init.appendRelativePath(".mozrepl.js");
  session_pref('extensions.mozrepl.initUrl', make_uri(mozrepl_init).spec);
}

// Use numeric key to switch buffers
function define_switch_buffer_key (key, buf_num) {
  define_key(default_global_keymap, key,
             function (I) {
               switch_to_buffer(I.window,
                                I.window.buffers.get_buffer(buf_num));
             });
}
for (let i = 0; i < 10; ++i) {
  define_switch_buffer_key(String((i+1)%10), i);
}

// Replacement of built-in C-x b
minibuffer.prototype.read_recent_buffer = function () {
  var window = this.window;
  var buffer = this.window.buffers.current;
  keywords(arguments, $prompt = "Buffer:",
           $default = buffer,
           $history = "buffer");
  var buffers = window.buffers.buffer_list.slice(0);
  buffers.push(buffers.shift());
  var completer = all_word_completer(
    $completions = buffers,
    $get_string = function (x) x.title,
    $get_description = function (x) x.description);
  var result = yield this.read(
    $keymap = read_buffer_keymap,
    $prompt = arguments.$prompt,
    $history = arguments.$history,
    $completer = completer,
    $match_required = true,
    $auto_complete = "buffer",
    $auto_complete_initial = true,
    $auto_complete_delay = 0,
    $default_completion = arguments.$default);
  yield co_return(result);
};
interactive("switch-to-recent-buffer",
            "Switch to a buffer specified in the minibuffer.  List of buffers "+
            "will be ordered by recency.",
            function (I) {
              switch_to_buffer(
                I.window,
                (yield I.minibuffer.read_recent_buffer(
                  $prompt = "Switch to buffer:",
                  $default = (I.window.buffers.count > 1 ?
                              I.window.buffers.buffer_list[1] :
                              I.buffer))));
            });
define_key(default_global_keymap, "C-x B", "switch-to-recent-buffer");
define_key(default_global_keymap, "C-tab", "switch-to-recent-buffer");
define_key(read_buffer_keymap, "C-tab", "minibuffer-complete");
define_key(read_buffer_keymap, "C-S-tab", "minibuffer-complete-previous");
define_key(default_global_keymap, "A-return", "switch-to-recent-buffer");
define_key(read_buffer_keymap, "A-return", "minibuffer-complete");
define_key(read_buffer_keymap, "A-S-return", "minibuffer-complete-previous");

// Readability tool
interactive("readability_arc90",
            "Readability is a simple tool that makes reading on the web more enjoyable by removing the clutter around what you are reading",
            function readability_arc90(I) {
              var document = I.window.buffers.current.document;

              var readConvertLinksToFootnotes = false;
              var readStyle = 'style-newspaper';
              var readSize = 'size-medium';
              var readMargin = 'margin-wide';

              var _readability_readStyle = document.createElement('SCRIPT');
              _readability_readStyle.text = 'var readStyle = \'' + readStyle + '\';';
              document.getElementsByTagName('head')[0].appendChild(_readability_readStyle);

              var _readability_readSize = document.createElement('SCRIPT');
              _readability_readSize.text = 'var readSize = \'' + readSize + '\';';
              document.getElementsByTagName('head')[0].appendChild(_readability_readSize);

              var _readability_readMargin = document.createElement('SCRIPT');
              _readability_readMargin.text = 'var readMargin = \'' + readMargin + '\';';
              document.getElementsByTagName('head')[0].appendChild(_readability_readMargin);

              var _readability_readConvertLinksToFootnotes = document.createElement('SCRIPT');
              _readability_readConvertLinksToFootnotes.text = 'var readConvertLinksToFootnotes = ' + readConvertLinksToFootnotes + ';';
              document.getElementsByTagName('head')[0].appendChild(_readability_readConvertLinksToFootnotes);

              var _readability_script = document.createElement('script')
              _readability_script.type='text/javascript'
              _readability_script.src='http://lab.arc90.com/experiments/readability/js/readability.js?x='+(Math.random())
              document.documentElement.appendChild(_readability_script)

              var _readability_css = document.createElement('link')
              _readability_css.rel = 'stylesheet'
              _readability_css.href = 'http://lab.arc90.com/experiments/readability/css/readability.css'
              _readability_css.type = 'text/css'
              _readability_css.media = 'all'
              document.documentElement.appendChild(_readability_css)

              var _readability_print_css = document.createElement('link')
              _readability_print_css.rel = 'stylesheet'
              _readability_print_css.href = 'http://lab.arc90.com/experiments/readability/css/readability-print.css'
              _readability_print_css.media = 'print'
              _readability_print_css.type = 'text/css'
              document.getElementsByTagName('head')[0].appendChild(_readability_print_css)
            });
define_key(content_buffer_normal_keymap, "j", "readability_arc90");

// What's this?
function repl_context() {
  let ctx = {};
  ctx.__proto__ = conkeror;
  ctx.conkeror = conkeror;
  ctx.window = conkeror.get_recent_conkeror_window();
  ctx.buffer = ctx.window.buffers.current;
  ctx.document = ctx.buffer.document;
  return ctx;
}

// The rest is experimental ----------------------------------------------------

// Darken page
// TODO: use a boolean to keep track of dark/light state
// TODO: add hook for new buffers
function foo (I) {
  var styles='* { background: black !important; color: gray !important; }'+
    ':link, :link * { color: #4986dd !important; }'+
    ':visited, :visited * { color: #d75047 !important; }';
  var wd = conkeror.get_recent_conkeror_window();
  // FIXME: better way for this?
  if (typeof foo.darkened == 'undefined') {
    foo.darkened = true;
  } else {
    foo.darkened = !foo.darkened;
  }
  // FIXME: content buffers only
  for (var i=0; i < wd.buffers.count; i++) {
    var document = I.window.buffers.get_buffer(i).document;
    var id = 'ubolonton/darken_page';
    let (newSS = document.getElementById(id)) {
      if (newSS == null) {
        if (foo.darkened) {
          newSS = document.createElement('link');
          newSS.rel = 'stylesheet';
          newSS.href = 'data:text/css,' + escape(styles);
          newSS.id = id;
          document.getElementsByTagName("head")[0].appendChild(newSS);
        }
      } else {
        if (!foo.darkened) {
          newSS.parentNode.removeChild(newSS);
        }
      }
    }
  }
}
interactive("foo", "Toggle darkening all pages", foo);
define_key(content_buffer_normal_keymap, "A-D", "foo");
function toggle_darkened_page (I) {
  var styles='* { background: black !important; color: gray !important; }'+
    ':link, :link * { color: #4986dd !important; }'+
    ':visited, :visited * { color: #d75047 !important; }';
  var document = I.buffer.document;
  var id = 'ubolonton/darken_page';
  let (newSS = document.getElementById(id)) {
    if (newSS == null) {
      newSS = document.createElement('link');
      newSS.rel = 'stylesheet';
      newSS.href = 'data:text/css,' + escape(styles);
      newSS.id = id;
      document.getElementsByTagName("head")[0].appendChild(newSS);
    } else {
      newSS.parentNode.removeChild(newSS);
    }
  }
}
interactive("toggle-darkened-page", "Toggle darkening the page in an attempt to save your eyes.",
            toggle_darkened_page);
define_key(content_buffer_normal_keymap, "A-d", "toggle-darkened-page");

// FIXME: the page is darkened only after the DOM is finished
// loading. This causes flickering, which is sub-optimal

define_variable("darkened", false, "Darkened or not");

function set_darkness (buffer) {
  var styles='* { background: black !important; color: gray !important; }'+
    ':link, :link * { color: #4986dd !important; }'+
    ':visited, :visited * { color: #d75047 !important; }';
  var document = buffer.document;
  var id = 'ubolonton/darken_page';
  let (newSS = document.getElementById(id)) {
    if (newSS == null) {
      if (darkened) {
        newSS = document.createElement('link');
        newSS.rel = 'stylesheet';
        newSS.href = 'data:text/css,' + escape(styles);
        newSS.id = id;
        document.getElementsByTagName("head")[0].appendChild(newSS);
      }
    } else {
      if (!darkened) {
        newSS.parentNode.removeChild(newSS);
      }
    }
  }
}

add_hook("buffer_dom_content_loaded_hook", set_darkness, false, true);
add_hook("buffer_loaded_hook", set_darkness, false, true);
