// On OS X, use Dvorak - No Dead Keys

// MozRepl first, to control stuff from Emacs should there be problems
// (4242)
user_pref('extensions.mozrepl.autoStart', true);
user_pref('extensions.mozrepl.loopbackOnly', false);
let (mozrepl_init = get_home_directory()) {
    mozrepl_init.appendRelativePath(".conkerorrc");
    mozrepl_init.appendRelativePath("mozrepl");
    mozrepl_init.appendRelativePath("init.js");
    session_pref('extensions.mozrepl.initUrl', make_uri(mozrepl_init).spec);
}

user_pref('browser.history_expire_days', 99999);

// Add custom modules & config to load path
function ublt_add_path(dir) {
let (path = get_home_directory()) {
  path.appendRelativePath(".conkerorrc");
    path.appendRelativePath(dir);
  load_paths.unshift(make_uri(path).spec);
}
}
ublt_add_path("modules");
ublt_add_path("config");

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

require("ublt-dvorak");
require("ublt-buffer");
require("ublt-webjumps");
require("ublt-appearance");
require("ublt-download");
require("ublt-proxy");
require("ublt-user-agents");
require("ublt-grooveshark");


// Misc

// Some useful built-in modules
require("daemon");
require("session");
require("dom-inspector");
require("gmail");

// Some useful additional modules
require("hackernews");

// Link sent from outside gets opened in new tab
url_remoting_fn = load_url_in_new_buffer;

// Go ahead if a DOM node is the sole selection
hints_auto_exit_delay = 500;

// Ask to restore session
// TODO: multiple session based on work/reading distinction
session_auto_save_auto_load = "prompt";

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

// Load clicked link in background
require("clicks-in-new-buffer.js");
clicks_in_new_buffer_target = OPEN_NEW_BUFFER_BACKGROUND;


// Google
require("page-modes/google-search-results.js");


// Other personal stuffs

// TODO: not that useful
interactive("viewmarks",
            "Open ViewMarks window.",
            function (I) {
                make_chrome_window('chrome://viewmarks/content/viewmark.xul');
            });

// XXX FIX: 7 is just because of my current theme
interactive("minibuffer-complete-next-page", null,
            function(I) { minibuffer_complete(I.window, 7); });
interactive("minibuffer-complete-previous-page", null,
            function(I) { minibuffer_complete(I.window, -7); });




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


// Search selected text in any app (need system-wide key binding (xbindkeys))

// conkeror -f search-clipboard-contents

interactive("search-clipboard-contents", "Search in Google the content of the selected text (or clipboard)",
              alternates(follow_new_buffer, follow_new_window),
              // "find-url-in-new-buffer",
              $browser_object=
              function(I) {
                  return "google "+ read_from_x_primary_selection();
              }
);
interactive("search-clipboard-contents-duckduckgo", "Search in duckduckgo.com the content of the selected text (or clipboard)",
              alternates(follow_new_buffer, follow_new_window),
              $browser_object=
              function(I) {
                  return "duckduckgo "+ read_from_x_primary_selection();
              }
);
interactive("search-clipboard-contents-doublequoted", "Search in Google the content of the selected text (or clipboard), as a fixed string",
              alternates(follow_new_buffer, follow_new_window),
              // "find-url-in-new-buffer",
              $browser_object=
              function(I) {
                  return "google \""+ read_from_x_primary_selection()+"\"";
              }

);


if ('@eff.org/https-everywhere;1' in Cc) {
  interactive("https-everywhere-options-dialog",
              "Open the HTTPS Everywhere options dialog.",
              function (I) {
                window_watcher.openWindow(
                  null, "chrome://https-everywhere/content/preferences.xul",
                  "", "chrome,titlebar,toolbar,centerscreen,resizable", null);
              });
}
