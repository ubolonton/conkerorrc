// Buffer manipulation enhancements


// Support for re-opening recently-closed buffers

var ublt_recent_buffers = [];
// FIX: add before_kill_buffer_hook to conkeror?
interactive("ublt-kill-current-buffer", "Kill current buffer after saving its url to be able to reopen",
            function(I) {
              var buffer = I.buffer;
              var uri = buffer.display_uri_string;
              kill_buffer(buffer);
              // TODO: limit
              ublt_recent_buffers.push(uri);
            });
interactive("ublt-open-last-closed-buffer", "Open the last closed buffer",
            function(I) {
              var url = ublt_recent_buffers[ublt_recent_buffers.length - 1];
              if (url) {
                load_url_in_new_buffer(url, I.window);
                ublt_recent_buffers.pop();
              }
            });


// Fast buffer switching

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
                                 I.window.buffers.buffer_history[1]
                                 || I.window.buffer);
            });


// Reload/stop reloading all buffers

interactive("stop-loading-all", "Stop loading all documents",
            function (I) {
                for (var i = 0; i < I.window.buffers.count; i++) {
                    stop_loading(I.window.buffers.get_buffer(i));
                }
            });

interactive("reload-all", "Reload all documents",
            function (I) {
                for (var i = 0; i < I.window.buffers.count; i++) {
                    reload(I.window.buffers.get_buffer(i));
                }
            });


// Better replacement of built-in buffer switcher

require("minibuffer");

minibuffer.prototype.read_recent_buffer = function () {
    var window = this.window;
    var buffer = this.window.buffers.current;
    keywords(arguments, $prompt = "Buffer:",
             $default = buffer,
             $history = "buffer");
    var buffers = window.buffers.buffer_history.slice(0);
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
                                    I.window.buffers.buffer_history[1] :
                                    I.buffer))));
            });



provide("ublt-buffer");