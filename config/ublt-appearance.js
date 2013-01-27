
// Visual aid
read_buffer_show_icons = true;

// Tab settings
require("favicon"); // they forgot this in new-tabs.js
require("new-tabs");
tab_bar_show_icon = true;
tab_bar_show_index = true;

// mode-line doodads
require("mode-line");
add_hook("mode_line_hook", mode_line_adder(loading_count_widget), true);
add_hook("mode_line_hook", mode_line_adder(buffer_count_widget), true);


// Theme

let (p = get_home_directory()) {
    p.append(".conkerorrc");
    p.append("themes");
    theme_load_paths.unshift(p);
}
theme_unload("default");
theme_load("ubolonton");
interactive("ublt-theme", "Load my personal theme",
            function(I) {
                theme_unload("ubolonton");
                theme_load("ubolonton");
            });


// Stylesheet toggling

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

interactive("toggle-gmail-fixed-width-messages",
            "Toggle between fixed-width/variable-width fonts for gmail messages",
            function(I) {
                toggle_custom_stylesheet("data:text/css,"
                                         + escape("@-moz-document domain(mail.google.com)" +
                                                  "{ div.ii, input { " +
                                                  "font-family: MonoSpace !important; font-size: 12px !important; }}"));
            });

interactive("toggle-google-groups-fixed-width-messages",
            "Toggle between fixed-width/variable-width fonts for google group messages",
            function(I) {
                toggle_custom_stylesheet("data:text/css,"
                                         + escape("@-moz-document domain(groups.google.com)" +
                                                  "{ div#body { " +
                                                  "font-family: MonoSpace !important; font-size: 12px !important; }}"));
            });


// Experimental dark mode
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



provide("ublt-appearance");
