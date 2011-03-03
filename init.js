// MozRepl (4242)
user_pref('extensions.mozrepl.autoStart', true);
user_pref('extensions.mozrepl.loopbackOnly', false);
let (mozrepl_init = get_home_directory()) {
    mozrepl_init.appendRelativePath(".conkerorrc/mozrepl/init.js");
    session_pref('extensions.mozrepl.initUrl', make_uri(mozrepl_init).spec);
}

// Link sent from outside gets opened in new tab
url_remoting_fn = load_url_in_new_buffer;

// TODO: How to determine system type?
// OSX: Command    => A    Option   => M
// GTK: Mod4/Super => A    Alt/Meta => M
modifiers.M = new modifier(function (event) { return event.altKey; },
                           function (event) { event.altKey = true; });
modifiers.A = new modifier(function (event) { return event.metaKey; },
                           function (event) { event.metaKey = true; });
modifier_order = ['C', 'M', 'A', 'S'];

require("global-overlay-keymap");
define_key_alias("C-m", "return");
define_key_alias("A-c", "M-w");
define_key_alias("A-x", "C-w");
define_key_alias("A-v", "C-y");

define_key_alias("M-c", "up");
define_key_alias("M-t", "down");
define_key_alias("M-h", "left");
define_key_alias("M-n", "right");
define_key_alias("M-C", "page_up");
define_key_alias("M-T", "page_down");
// consider M-H and M-N
define_key_alias("M-g", "C-left");
define_key_alias("M-r", "C-right");
define_key_alias("M-G", "home");
define_key_alias("M-R", "end");

define_key_alias("M-e", "back_space");
define_key_alias("M-u", "delete");
define_key_alias("M-.", "C-back_space");
define_key_alias("M-p", "C-delete");

define_key_alias("M-i", "C-k");
define_key_alias("M-d", "C-a");
define_key_alias("M-D", "C-e");
// TODO: remove definition for aliased keys

// Some useful modules
require("mode-line.js");
require("daemon.js");
require("session.js");
require("dom-inspector.js");
require("page-modes/gmail.js");

read_buffer_show_icons = true;

// FIXME: Hack
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
define_key(default_global_keymap, "A-r", "save-for-later");

// { background: #0C141E !important; color: #A0AFA8 !important; }'+
//         ':link, :link * { color: #4986dd !important; }'+
//         ':visited, :visited * { color: #d75047 !important; }';

session_auto_save_auto_load = "prompt";

interactive("viewmarks",
    "Open ViewMarks window.",
    function (I) {
        make_chrome_window('chrome://viewmarks/content/viewmark.xul');
    });

// Tab settings
require("favicon.js"); // they forgot this in new-tabs.js
require("new-tabs.js");
tab_bar_show_icon = true;
tab_bar_show_index = true;

// Textmate as external editor
editor_shell_command = "emacsclient";

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

// Personal theme
theme_load_paths.unshift("/Users/ubolonton/.conkerorrc/themes/");
theme_unload("default");
theme_load("ubolonton");
interactive("ubolonton-theme", "Load my personal theme",
            function(I) {
                theme_load("ubolonton");
            });

// Remember credentials
user_pref("signon.prefillForms", true);
user_pref("signon.autofillForms", true);
user_pref("signon.rememberSignons", true);

// Custom key-bindings
define_key(default_global_keymap, "A-{", "buffer-previous");
define_key(default_global_keymap, "A-}", "buffer-next");
define_key(default_global_keymap, "A--", "zoom-out-full");
define_key(default_global_keymap, "A-t", "find-url-new-buffer");
define_key(default_global_keymap, "A-s", "save-page-complete");
define_key(default_global_keymap, "A-i", "inspect-chrome");
define_key(default_global_keymap, "A-u", "ubolonton-theme");
define_key(default_global_keymap, "A-`", null, $fallthrough);
define_key(default_global_keymap, "C-x B", "switch-to-recent-buffer");
define_key(default_global_keymap, "C-tab", "switch-to-recent-buffer");
define_key(default_global_keymap, "A-return", "switch-to-recent-buffer");
define_key(default_global_keymap, "A-h", "switch-to-recent-buffer");
define_key(default_global_keymap, "A-=", "zoom-in-full");

define_key(default_global_keymap, "0",
           function (I)
           {
               switch_to_buffer(I.window,
                                I.window.buffers.get_buffer(I.window.buffers.count - 1));
           });

define_key(default_global_keymap, "C-G",
           function (I)
           {
               for (var i = 0; i < I.window.buffers.count; i++)
               {
                   stop_loading(I.window.buffers.get_buffer(i));
               }
           });

define_key(default_global_keymap, "A-n",
           function (I)
           {
               switch_to_buffer(I.window,
                                I.window.buffers.buffer_list[1])
           });

define_key(content_buffer_normal_keymap, "M-f", "follow-new-buffer-background");
define_key(content_buffer_normal_keymap, "A-[", "back");
define_key(content_buffer_normal_keymap, "A-]", "forward");

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

define_key(gmail_keymap, "v", null, $fallthrough);

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
interactive("foo", "Toggle darkening all pages", foo);
define_key(content_buffer_normal_keymap, "f7", "foo");
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
define_key(content_buffer_normal_keymap, "A-d", "toggle-darkened-page");

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

interactive("colors-toggle", "toggle between document and forced colors",
            function (I) {
              var p = "browser.display.use_document_colors";
              if (get_pref(p)) {
                  session_pref("browser.active_color", "yellow");
                  session_pref("browser.anchor_color", "#4986dd");
                  session_pref("browser.display.background_color", "#0C141E");
                  session_pref("browser.display.foreground_color", "#A0AFA8");
                  session_pref("browser.display.focus_background_color", "green");
                  session_pref("browser.display.focus_text_color", "red");
                  session_pref("browser.visited_color", "#d75047");
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
define_key(content_buffer_normal_keymap, "f6", "colors-toggle");

