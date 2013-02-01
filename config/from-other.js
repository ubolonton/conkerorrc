
// retroj

homepage = "http://apod.nasa.gov/apod/";

/*
 * url-completion-toggle is a temporary workaround for the problem
 * that url_completion_use_bookmarks and url_completion_use_history
 * are mutually exclusive.
 */
function url_completion_toggle (I) {
    if (url_completion_use_bookmarks) {
        url_completion_use_bookmarks = false;
        url_completion_use_history = true;
        I.window.minibuffer.message("Completion uses history");
    } else {
        url_completion_use_bookmarks = true;
        url_completion_use_history = false;
        I.window.minibuffer.message("Completion uses bookmarks");
    }
}
interactive("url-completion-toggle",
            "toggle between bookmark and history completion",
            url_completion_toggle);
define_key(content_buffer_normal_keymap, "C-c t", "url-completion-toggle");




var minibuffer_history_file = make_file("~/.conkerorrc/.minibuffer-history.json");

function save_minibuffer_history () {
    var mr_json = Cc["@mozilla.org/dom/json;1"]
        .createInstance(Ci.nsIJSON);
    var str = mr_json.encode(minibuffer_history_data);
    write_text_file(minibuffer_history_file, str);
}

function load_minibuffer_history () {
    var mr_json = Cc["@mozilla.org/dom/json;1"]
        .createInstance(Ci.nsIJSON);
    var data = mr_json.decode(read_text_file(minibuffer_history_file));
    minibuffer_history_data = data;
}




// Default webjump
read_url_handler_list = [read_url_make_default_webjump_handler("duckduckgo")];

function possibly_valid_url (str) {
    return /^\s*[^\/\s]*(\/|\s*$)/.test(str)
        && /[:\/\.]/.test(str);
}




// tinyurl
define_browser_object_class("tinyurl",
    "Get a tinyurl for the current page",
    function (I, prompt) {
        check_buffer(I.buffer, content_buffer);
        let createurl = 'http://tinyurl.com/api-create.php?url=' +
            encodeURIComponent(
                load_spec_uri_string(
                    load_spec(I.buffer.top_frame)));
        try {
            var content = yield send_http_request(
                load_spec({uri: createurl}));
            yield co_return(content.responseText);
        } catch (e) { }
    });

define_key(content_buffer_normal_keymap, "* q", "browser-object-tinyurl");


provide("from-other");