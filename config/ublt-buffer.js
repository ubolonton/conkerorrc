// Buffer manipulation enhancements
require("ublt");


// Support for re-opening recently-closed buffers

var ublt_recent_buffers = [];
// FIX: add before_kill_buffer_hook to conkeror?
interactive("ublt-kill-current-buffer", "Kill current buffer after saving its url to for re-opening if needed",
            function(I) {
              var buffer = I.buffer;
              var url = buffer.display_uri_string;
              kill_buffer(buffer);
              // TODO: limit
              ublt_recent_buffers.push(url);
            });
interactive("ublt-open-last-closed-buffer", "Open the last closed buffer",
            function(I) {
              var url = ublt_recent_buffers[ublt_recent_buffers.length - 1];
              if (url) {
                load_url_in_new_buffer(url, I.window);
                ublt_recent_buffers.pop();
              }
            });

interactive("ublt-open-closed-buffer", "Select a recently closed buffer to re-open",
            function(I) {
              if (ublt_recent_buffers.length > 0) {
                var url = yield I.window.minibuffer.read(
                  $prompt = "Restore:",
                  $completer = prefix_completer(
                    $completions = ublt_recent_buffers,
                    $get_string = function(x) {
                      return x ? x.toString() : "";
                    }
                  ),
                  $default_completion = ublt_recent_buffers[ublt_recent_buffers.length - 1]
                  // $auto_complete = "url",
                  // $auto_complete_initial = true,
                  // $auto_complete_delay = 0,
                  // $match_required
                );
                // Remove from the list?
                load_url_in_new_buffer(url);
              } else {
                I.window.minibuffer.message("No recently closed buffer");
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
            return " " + x.title || "";
        },
        $get_description = function (x) {
          return x.description || "";
        },
        $get_icon = (read_buffer_show_icons ?
                     function (x) {
                       return x.icon || null;
                     } : null)
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


// Function to fix context switching hanging minibuffer
function ublt_fix_minibuffer() {
  var window = get_recent_conkeror_window();
  var buffer_container = window.buffers;
  var buffer = buffer_container.buffer_list[0];
  buffer_container._switch_to(buffer);
}


// Launchers

ublt.add({
  is_buffer_loaded: function(buffer) {
    return buffer.display_uri_string === buffer.browser.contentWindow.location.href;
  },

  // Defines a command that switches to the first buffer that
  // satisfies the checker. If no buffer is found, open the given url
  // in a new buffer instead.
  define_launcher: function(name, url, buffer_checker) {
    var dashed_name = name.replace(" ", "-");
    interactive("ublt-launch-" + dashed_name, "Launch " + name, function(I) {
      // TODO: Something better, this is slow
      var buffer_list = I.window.buffers;
      for (let i = 0; i < buffer_list.count; ++i) {
        var b = buffer_list.get_buffer(i);
        // TODO: Does the checker really need to check the whole
        // buffer, or just the uri?
        if (buffer_checker(b)) {
          // Load the page if it's not loaded yet
          if (!ublt.is_buffer_loaded(b)) {
            b.load(load_spec(b.display_uri_string));
          }
          switch_to_buffer(I.window, b);
          unfocus(I.window, b);
          return;
        }
      }
      // TODO: Is "unfocus" the right way to bring Conkeror to the
      // front?
      unfocus(I.window, I.buffer);
      // No existing buffer found, open new one
      browser_object_follow(I.buffer, OPEN_NEW_BUFFER, load_spec(url));
    });
  },

  define_simple_launcher: function(name, url) {
    var hostPort = make_uri(url).hostPort;
    ublt.define_launcher(name, url, function(buffer) {
      return hostPort === make_uri(buffer.display_uri_string).hostPort;
    });
  }
});

// Use xbindkeys to assign keys to these
ublt.define_simple_launcher("GMail", "https://mail.google.com");
ublt.define_simple_launcher("Facebook", "https://www.facebook.com");
ublt.define_simple_launcher("Grooveshark", "http://grooveshark.com");
ublt.define_simple_launcher("Prismatic", "http://getprismatic.com");
ublt.define_launcher("Coursera", "https://www.coursera.org", function(b) {
  return make_uri(b.display_uri_string).hostPort.search("coursera.org") > -1;
});
ublt.define_launcher("Google Reader", "https://www.google.com/reader", function(b) {
  var uri = make_uri(b.display_uri_string);
  return uri.hostPort == "www.google.com" &&
    uri.path.search("/reader") == 0;
});




provide("ublt-buffer");
