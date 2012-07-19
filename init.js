// MozRepl first, to control stuff from Emacs should there be problems
// (4242)
user_pref('extensions.mozrepl.autoStart', true);
user_pref('extensions.mozrepl.loopbackOnly', false);
let (mozrepl_init = get_home_directory()) {
    mozrepl_init.appendRelativePath(".conkerorrc/mozrepl/init.js");
    session_pref('extensions.mozrepl.initUrl', make_uri(mozrepl_init).spec);
}

user_pref('browser.history_expire_days', 99999);

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

// Custom key bindings
// TODO: Conkeror chains translation, unlike Emacs, so swapping or
// aggressive rearrangement is not possible.

// TODO: How to determine system type?
// OSX:    Command    => A    Option   => M
// Ubuntu: Mod4/Super => A    Alt/Meta => M
modifiers.M = new modifier(function (event) { return event.altKey; },
                           function (event) { event.altKey = true; });
modifiers.A = new modifier(function (event) { return event.metaKey; },
                           function (event) { event.metaKey = true; });
modifier_order = ['C', 'M', 'A', 'S'];

require("global-overlay-keymap");
// OS X style
define_key_alias("A-c", "M-w");
define_key_alias("A-x", "C-w");
define_key_alias("A-v", "C-y");
define_key_alias("A-z", "C-_");
define_key_alias("A-Z", "C-?");

// Because right pinky is overworked. Really? I would think left pinky
// is often stressed more.
define_key_alias("C-m", "return");

// Dvorak movement
define_key_alias("M-c", "up");
define_key_alias("M-t", "down");
define_key_alias("M-h", "left");
define_key_alias("M-n", "right");
define_key_alias("M-C", "page_up");
define_key_alias("M-T", "page_down");
// TODO: consider M-H and M-N
define_key_alias("M-g", "C-left");
define_key_alias("M-r", "C-right");
define_key_alias("M-G", "home");
define_key_alias("M-R", "end");

// Dvorak deletion
define_key_alias("M-e", "back_space");
define_key_alias("M-u", "delete");
define_key_alias("M-.", "C-back_space");
define_key_alias("M-p", "C-delete");

// Dvorak remaining
define_key_alias("M-i", "C-k");
define_key_alias("M-d", "C-a");
define_key_alias("M-D", "C-e");

// C- M- is much worse than M- M-
define_key_alias("M-space", "C-space");

// define_key_alias("C-t", "C-x");

// TODO: remove definition for aliased keys
// FIXME: define multiple keys in one pass
// OS X conventions
define_key(default_global_keymap, "A-{", "buffer-previous");
define_key(default_global_keymap, "A-}", "buffer-next");
define_key(default_global_keymap, "A-=", "zoom-in-full");
define_key(default_global_keymap, "A--", "zoom-out-full");
define_key(default_global_keymap, "A-t", "find-url-new-buffer");
define_key(default_global_keymap, "A-`", null, $fallthrough);
define_key(default_global_keymap, "A-tab", null, $fallthrough);
// Uhm, so many keys to waste
define_key(default_global_keymap, "A-k", "kill-current-buffer");
define_key(default_global_keymap, "A-i", "inspect-chrome");
define_key(default_global_keymap, "A-u", "ubolonton-theme");
define_key(default_global_keymap, "A-h", "switch-to-recent-buffer");
define_key(default_global_keymap, "A-g", "caret-mode");
define_key(default_global_keymap, "f6", "colors-toggle");
define_key(default_global_keymap, "f7", "darken-page-mode");
define_key(default_global_keymap, "f8", "toggle-gmail-fixed-width-messages");
define_key(default_global_keymap, "A-n", "switch-to-last-buffer");
define_key(default_global_keymap, "C-G", "stop-loading-all");
define_key(default_global_keymap, "0", "switch-to-last-tab");
define_key(default_global_keymap, "C-M-h", "buffer-previous");
define_key(default_global_keymap, "C-M-n", "buffer-next");
define_key(default_global_keymap, "h", "find-url-from-history-new-buffer");
define_key(default_global_keymap, "H", "find-url-from-history");
// define_key(default_global_keymap, "M-m", "buffer-previous");
// define_key(default_global_keymap, "M-v", "buffer-next");

define_key(content_buffer_normal_keymap, "A-s", "save-page-complete");
define_key(content_buffer_normal_keymap, "M-f", "follow-new-buffer-background");
define_key(content_buffer_normal_keymap, "A-[", "back");
define_key(content_buffer_normal_keymap, "A-]", "forward");
define_key(content_buffer_normal_keymap, "R", "readability_arc90");
define_key(content_buffer_normal_keymap, "A-d", "toggle-darkened-page");
define_key(content_buffer_normal_keymap, "A-r", "save-for-later");
define_key(content_buffer_normal_keymap, "C-c C-c", "submit-form");
define_key(content_buffer_normal_keymap, "M-A-h", "back");
define_key(content_buffer_normal_keymap, "M-A-n", "forward");

// Dvorak
define_key(content_buffer_normal_keymap, "M-c", "cmd_scrollLineUp");
define_key(content_buffer_normal_keymap, "M-t", "cmd_scrollLineDown");
define_key(content_buffer_normal_keymap, "M-h", "cmd_scrollLeft");
define_key(content_buffer_normal_keymap, "M-n", "cmd_scrollRight");
define_key(content_buffer_normal_keymap, "M-C", "cmd_scrollPageUp");
define_key(content_buffer_normal_keymap, "M-T", "cmd_scrollPageDown");
define_key(content_buffer_normal_keymap, "M-H", "scroll",
           $browser_object = browser_object_previous_heading);
define_key(content_buffer_normal_keymap, "M-N", "scroll",
           $browser_object = browser_object_next_heading);
define_key(content_buffer_normal_keymap, "M-G", "scroll-top-left");
define_key(content_buffer_normal_keymap, "M-R", "cmd_scrollBottom");

define_key(text_keymap, "M-c", "cmd_scrollLineUp");
define_key(text_keymap, "M-t", "cmd_scrollLineDown");
define_key(text_keymap, "M-h", "backward-char");
define_key(text_keymap, "M-n", "forward-char");
define_key(text_keymap, "M-g", "backward-word");
define_key(text_keymap, "M-r", "forward-word");
define_key(text_keymap, "M-C", "cmd_scrollPageUp");
define_key(text_keymap, "M-T", "cmd_scrollPageDown");
define_key(text_keymap, "M-H", "scroll",
           $browser_object = browser_object_previous_heading);
define_key(text_keymap, "M-N", "scroll",
           $browser_object = browser_object_next_heading);
define_key(text_keymap, "M-G", "scroll-top-left");
define_key(text_keymap, "M-R", "cmd_scrollBottom");

define_key(read_buffer_keymap, "A-i", "inspect-chrome");
define_key(read_buffer_keymap, "C-tab", "minibuffer-complete");
define_key(read_buffer_keymap, "C-S-tab", "minibuffer-complete-previous");
define_key(read_buffer_keymap, "A-return", "minibuffer-complete");
define_key(read_buffer_keymap, "A-S-return", "minibuffer-complete-previous");
define_key(read_buffer_keymap, "A-h", "exit-minibuffer");
define_key(read_buffer_keymap, "A-h", "exit-minibuffer");

define_key(minibuffer_keymap, "C-m", "exit-minibuffer");

define_key(hint_keymap, "C-m", "hints-exit");

require("page-modes/gmail.js");
define_key(gmail_keymap, "v", null, $fallthrough);
define_key(gmail_keymap, "space", null, $fallthrough);
define_key(gmail_keymap, "S-space", null, $fallthrough);
define_key(gmail_keymap, "page_up", null, $fallthrough);
define_key(gmail_keymap, "page_down", null, $fallthrough);

// Misc

// Some useful modules
require("mode-line.js");
require("daemon.js");
require("session.js");
require("dom-inspector.js");

// Link sent from outside gets opened in new tab
url_remoting_fn = load_url_in_new_buffer;

// Visual aid
read_buffer_show_icons = true;

// Ask to restore session
// TODO: multiple session based on work/reading distinction
session_auto_save_auto_load = "prompt";

// Tab settings
require("favicon.js"); // they forgot this in new-tabs.js
require("new-tabs.js");
tab_bar_show_icon = true;
tab_bar_show_index = true;

// Emacs-everywhere illusion
editor_shell_command = "emacsclient";

// Quit confirmation
add_hook("before_quit_hook",
         function () {
             var w = get_recent_conkeror_window();
             var result = (w == null) ||
                 "y" == (yield w.minibuffer.read_single_character_option(
                     $prompt = "Quit Conkeror? (y/n)",
                     $options = ["y", "n"]));
             yield co_return(result);
         });
can_kill_last_buffer = false;

// Remember credentials
// TODO: M-x password-manager still needed once per session
user_pref("signon.prefillForms", true);
user_pref("signon.autofillForms", true);
user_pref("signon.rememberSignons", true);
Components.classes["@mozilla.org/login-manager;1"]
    .getService(Components.interfaces.nsILoginManager);

// Use history not bookmark?
url_completion_use_history = true;

// XKCD
xkcd_add_title = true;

// Download in background
download_buffer_automatic_open_target = OPEN_NEW_BUFFER_BACKGROUND;

// Load clicked link in background
require("clicks-in-new-buffer.js");
clicks_in_new_buffer_target = OPEN_NEW_BUFFER_BACKGROUND;

// mode-line doodads
add_hook("mode_line_hook", mode_line_adder(loading_count_widget), true);
add_hook("mode_line_hook", mode_line_adder(buffer_count_widget), true);

// Download

function suggest_save_path_from_file_name(file_name, buffer) {
    var cwd = with_current_buffer(buffer, function (I) I.local.cwd);
    var file = cwd.clone();
    for (let re in replace_map) {
        if (file_name.match(re)) {
            if (replace_map[re].path) {
                file = make_file(replace_map[re].path);
            }
            // file_name = replace_map[re].transformer(file_name);
        }
    }
    file.append(file_name);
    return file.path;
}

// Default location by type
let (d = get_home_directory()) {
    d.append("Downloads");
    // TODO: Windows?
    var replace_map = {
        ".": {
            "path": d.path,
            // "transformer": function(x) x
        },
        "\.(html|pdf|ps)$": {
            "path": d.path + "/Documents/",
        },
        "\.(dmg|zip)$": {
            "path": d.path + "/Documents/",
        },
        "\.(mp3)$": {
            "path": d.path + "/Music/",
        },
        "\.(mov|mp4|avi)$": {
            "path": d.path + "/Video/",
        }
    }
}

// Other personal stuffs

// From technomancy
interactive("toggle-stylesheets",
            "Toggle whether conkeror uses style sheets (CSS) for the " +
            "current buffer. It is sometimes useful to turn off style " +
            "sheets when the web site makes obnoxious choices.",
            function(I) {
              var s = I.buffer.document.styleSheets;
              for (var i = 0; i < s.length; i++)
                s[i].disabled = !s[i].disabled;
            });
require("page-modes/google-search-results.js");

let (p = get_home_directory()) {
    p.append(".conkerorrc");
    p.append("themes");
    theme_load_paths.unshift(p);
}
theme_unload("default");
theme_load("ubolonton");
interactive("ubolonton-theme", "Load my personal theme",
            function(I) {
                theme_unload("ubolonton");
                theme_load("ubolonton");
            });

// TODO: not that useful
interactive("viewmarks",
            "Open ViewMarks window.",
            function (I) {
                make_chrome_window('chrome://viewmarks/content/viewmark.xul');
            });

interactive("switch-to-last-tab", "Switch to the last tab",
            function (I) {
                switch_to_buffer(I.window,
                                 I.window.buffers.get_buffer(I.window.buffers.count - 1));
            });
interactive("switch-to-last-buffer", "Switch to the last visited buffer",
            function (I) {
                switch_to_buffer(I.window,
                                 // This is the way to go in newer
                                 // conkeror versions
                                 I.window.buffers.buffer_history[1])
            });

interactive("stop-loading-all", "Stop loading all documents",
            function (I) {
                for (var i = 0; i < I.window.buffers.count; i++)
                {
                    stop_loading(I.window.buffers.get_buffer(i));
                }
            });

interactive("reload-all", "Reload all documents",
            function (I) {
                for (var i = 0; i < I.window.buffers.count; i++)
                {
                    reload(I.window.buffers.get_buffer(i));
                }
            });


// Some webjumps
// TODO: key for this not webjump
define_webjump("bm",
               function(term) {return term;},
               $completer = history_completer($use_history = false,
                                              $use_bookmarks = true,
                                              $match_required = true),
               $description = "Visit a conkeror bookmark");
define_webjump("dd", "http://duckduckgo.com/?q=%s",
               $description = "Duckduckgo web search");
define_webjump("pd", "http://search.pdfchm.net/?q=%s",
               $description = "pdfchm book search");
define_webjump("pr", "http://thepiratebay.org/search/%s",
               $description = "Pirate Bay torrent search");
define_webjump("wa", "http://www.wolframalpha.com/input/?i=%s",
               $description = "Wolfram Alpha query");
// define_webjump("pr",
//                function(term) {
//                  return "http://thepiratebay.org/tag/" + term.split(" ").join("+");
//                },
//                $description = "Pirate Bay torrent search");

// Use numeric key to switch buffers
function define_switch_buffer_key (key, buf_num) {
    define_key(default_global_keymap, key,
               function (I) {
                   switch_to_buffer(I.window,
                                    I.window.buffers.get_buffer(buf_num));
               });
}
for (let i = 0; i < 9; ++i) {
    define_switch_buffer_key(String((i+1)%10), i);
}

// Replacement of built-in buffer switcher

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
        $get_string = function (x) {
            return ' ' + x.title;
        },
        $get_description = function (x) x.description,
        $get_icon = (read_buffer_show_icons ?
                     function (x) x.icon : null)
    );
    var result = yield this.read(
        $keymap = read_buffer_keymap,
        $prompt = arguments.$prompt,
        $history = arguments.$history,
        $completer = completer,
        $enable_icons = read_buffer_show_icons,
        $match_required = true,
        $auto_complete = "buffer",
        $auto_complete_initial = true,
        $auto_complete_delay = 0,
        $default_completion = arguments.$default
    );
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

// HACK
interactive("switch-to-gmail-buffer",
            "Switch to GMail",
            function (I) {
              var bs = I.window.buffers;
              for (let i = 0; i < bs.count; ++i) {
                var b = bs.get_buffer(i);
                if (b.document.location.hostname == "mail.google.com") {
                  switch_to_buffer(I.window, b);
                  return;
                }
              }
            });

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

// The rest is experimental ----------------------------------------------------
// FIXME: fix those hacks

// Darken page
// TODO: use a boolean to keep track of dark/light state
// TODO: add hook for new buffers
function darken_page_mode (I) {
    var styles='* { background: #0C141E !important; color: #A0AFA8 !important; }'+
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
interactive("darken-page-mode", "Toggle darkening all pages", darken_page_mode);
function toggle_darkened_page (I) {
    var styles='* { background: #0C141E !important; color: #A0AFA8 !important; }'+
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

// FIXME: the page is darkened only after the DOM is finished
// loading. This causes flickering, which is sub-optimal

define_variable("darkened", false, "Darkened or not");

function set_darkness (buffer) {
    var styles='* { background: #0C141E !important; color: #A0AFA8 !important; }'+
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

// make the nasa-hsf-sightings page more printer friendly
// register_user_stylesheet(
//     "data:text/css," +
//         escape (
//             "@-moz-document url-prefix("+

// "http://spaceflight1.nasa.gov/realdata/sightings/cities/view.cgi)"+
//                 "{img { display: none; }}"));

// /* Fixed-width textareas everywhere. */
// textarea {
//     font-family: MonoSpace !important;
//     font-size: 14px !important;
// }

// Gmail messages
let(st_on = false) {
    function toggle_custom_stylesheet(str) {
        if (!st_on) {
            register_user_stylesheet(str);
        } else {
            unregister_user_stylesheet(str);
        };
        st_on = !st_on;
    };
};

interactive("toggle-gmail-fixed-width-messages", "",
            function(I) {
                toggle_custom_stylesheet("data:text/css,"
                                         + escape("@-moz-document domain(mail.google.com)" +
                                                  "{ div.ii, input { " +
                                                  "font-family: MonoSpace !important; font-size: 12px !important; }}"));
            });

interactive("toggle-google-groups-fixed-width-messages", "",
            function(I) {
                toggle_custom_stylesheet("data:text/css,"
                                         + escape("@-moz-document domain(groups.google.com)" +
                                                  "{ div#body { " +
                                                  "font-family: MonoSpace !important; font-size: 12px !important; }}"));
            });

interactive("colors-toggle", "toggle between document and forced colors",
            function (I) {
                var p = "browser.display.use_document_colors";
                if (get_pref(p)) {
                    session_pref("browser.active_color", "yellow");
                    session_pref("browser.anchor_color", "#4986dd");
                    session_pref("browser.display.background_color", "#0C141E");
                    session_pref("browser.display.foreground_color", "#A0AFA8");
                    session_pref("browser.display.focus_background_color", "green"); // ?
                    session_pref("browser.display.focus_text_color", "red"); // ?
                    session_pref("browser.visited_color", "#805DBB");
                    session_pref(p, false);
                } else {
                    session_pref("browser.active_color", "#EE0000");
                    session_pref("browser.anchor_color", "#0000EE");
                    session_pref("browser.display.background_color", "#FFFFFF");
                    session_pref("browser.display.foreground_color", "#000000");
                    session_pref("browser.display.focus_background_color", "#117722");
                    session_pref("browser.display.focus_text_color", "#FFFFFF");
                    session_pref("browser.visited_color", "#551A8B");
                    session_pref(p, true);
                }
            });

define_variable("firebug_url",
                "/home/ubolonton/Programming/Tools/firebug-lite/build/firebug-lite.js");

function firebug (I) {
    var doc = I.buffer.document;
    var script = doc.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', firebug_url);
    script.setAttribute('onload', 'firebug.init();');
    doc.body.appendChild(script);
};

interactive("firebug", "open firebug lite", firebug);

interactive("save-for-later",
            "Save a page and all supporting documents, including images, css, "+
            "and child frame documents to a folder for later reading.",
            function (I) {
                check_buffer(I.buffer, content_buffer);
                var element = yield read_browser_object(I);
                var spec = load_spec(element);
                var doc;
                if (!(doc = load_spec_document(spec)))
                    throw interactive_error("Element is not associated with a document.");
                var suggested_path = get_home_directory();
                suggested_path.appendRelativePath("read_later");

                var panel;
                panel = create_info_panel(I.window, "download-panel",
                                          [["downloading",
                                            element_get_operation_label(element, "Saving complete"),
                                            load_spec_uri_string(spec)],
                                           ["mime-type", "Mime type:", load_spec_mime_type(spec)]]);

                try {
                    var file = yield I.minibuffer.read_file_check_overwrite(
                        $prompt = "Save page complete:",
                        $history = "save",
                        $initial_value = suggested_path.path + "/" + suggest_file_name(spec));
                    // FIXME: use proper read function
                    var dir = yield I.minibuffer.read_file(
                        $prompt = "Data Directory:",
                        $history = "save",
                        $initial_value = file.path + ".support");
                } finally {
                    panel.destroy();
                }

                save_document_complete(doc, file, dir, $buffer = I.buffer);
            },
            $browser_object = browser_object_frames);


// http://conkeror.org/History
define_browser_object_class(
    "history-url", null,
    function (I, prompt) {
        check_buffer (I.buffer, content_buffer);
        var result = yield I.buffer.window.minibuffer.read_url(
            $prompt = prompt,  $use_webjumps = false, $use_history = true, $use_bookmarks = false);
        yield co_return (result);
    });

interactive("find-url-from-history",
            "Find a page from history in the current buffer",
            "find-url",
            $browser_object = browser_object_history_url);

interactive("find-url-from-history-new-buffer",
            "Find a page from history in the current buffer",
            "find-url-new-buffer",
            $browser_object = browser_object_history_url);

interactive("search-clipboard-contents", "Search in Google the content of the selected text (or clipboard)",
              alternates(follow_new_buffer, follow_new_window),
              // "find-url-in-new-buffer",
              $browser_object=
              function(I) {
                  return "g "+ read_from_x_primary_selection();
              }
);
interactive("search-clipboard-contents-duckduckgo", "Search in duckduckgo.com the content of the selected text (or clipboard)",
              alternates(follow_new_buffer, follow_new_window),
              $browser_object=
              function(I) {
                  return "dd "+ read_from_x_primary_selection();
              }
);
interactive("search-clipboard-contents-doublequoted", "Search in Google the content of the selected text (or clipboard), as a fixed string",
              alternates(follow_new_buffer, follow_new_window),
              // "find-url-in-new-buffer",
              $browser_object=
              function(I) {
                    return "g \""+ read_from_x_primary_selection()+"\"";
                    }

);

// Proxy

proxy_server_default = "proxy.rmit.edu.vn";
proxy_port_default = 8080;

function set_proxy_session (window, server, port) {
    if (server == "N") {
       session_pref('network.proxy.type', 0); //direct connection
       window.minibuffer.message("Direction connection to the internet enabled for this session");
    } else {
      if (server == "") server = proxy_server_default;
      if (port == "") port = proxy_port_default;

      session_pref('network.proxy.ftp',    server);
      session_pref('network.proxy.gopher', server);
      session_pref('network.proxy.http',   server);
      session_pref('network.proxy.socks',  server);
      session_pref('network.proxy.ssl',    server);

      session_pref('network.proxy.ftp_port',    port);
      session_pref('network.proxy.gopher_port', port);
      session_pref('network.proxy.http_port',   port);
      session_pref('network.proxy.socks_port',  port);
      session_pref('network.proxy.ssl_port',    port);

      session_pref('network.proxy.share_proxy_settings', 'true');
      session_pref('network.proxy.type', 1);

      window.minibuffer.message("All protocols using "+server+":"+port+" for this session");
    }
}

interactive("set-proxy-session",
    "set the proxy server for all protocols for this session only",
    function (I) {
        set_proxy_session(
            I.window,
            (yield I.minibuffer.read($prompt = "server ["+proxy_server_default+"] or N: ")),
            (yield I.minibuffer.read($prompt = "port ["+proxy_port_default+"]: ")));
    });

// Impersonating other browsers
var user_agents = {
  "conkeror": "Mozilla/5.0 (X11; Linux x86_64; rv:8.0.1) " + "Gecko/20100101 conkeror/1.0pre",
  "ipad": "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) " +
    "AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b " +
    "Safari/531.21.10",
  "iphone": "Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) " +
    "AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a " +
    "Safari/419.3",
  "chromium": "Mozilla/5.0 (X11; U; Linux x86_64; en-US) " +
    "AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.63" +
    " Safari/534.3",
  "firefox": "Mozilla/5.0 (X11; Linux x86_64; rv:8.0.1) " +
    "Gecko/20100101 Firefox/8.0.1",
  "android": "Mozilla/5.0 (Linux; U; Android 2.2; en-us; " +
    "Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like " +
    "Gecko) Version/4.0 Mobile Safari/533.1"};

var agent_completer = prefix_completer($completions = Object.keys(user_agents));

interactive("user-agent", "Pick a user agent from the list of presets",
            function(I) {
                var ua = (yield I.window.minibuffer.read(
                    $prompt = "Agent:",
                    $completer = agent_completer));
                set_user_agent(user_agents[ua]);
            });
