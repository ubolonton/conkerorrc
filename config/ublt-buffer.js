// Buffer manipulation enhancements
require("ublt");

ublt.ns("ublt.buffer", {
  is_loaded: function(buffer) {
    return buffer.display_uri_string === buffer.browser.contentWindow.location.href;
  },

  // Function to fix context switching hanging minibuffer
  fix_minibuffer: function() {
    var window = get_recent_conkeror_window();
    var buffer_container = window.buffers;
    var buffer = buffer_container.buffer_list[0];
    buffer_container._switch_to(buffer);
  },

  orig_kill_buffer: buffer_container.prototype.kill_buffer
});

_.extend(buffer_container.prototype, {
  // Patch "kill_buffer" to store closed buffer's url
  // FIX: add before_kill_buffer_hook to conkeror?
  kill_buffer: function(buffer) {
    this.closed_urls = this.closed_urls || [];
    var url = buffer.display_uri_string;
    var data = {
      scrollX: buffer.scrollX,
      scrollY: buffer.scrollY
    };
    var result = ublt.buffer.orig_kill_buffer.call(this, buffer);
    // TODO: limit
    if (result) {
      // this.closed_urls[url] = data;
      this.closed_urls.push([url, data]);
    }
    return result;
  },

  open_last_closed: function() {
    var recent = this.closed_urls;
    if (recent.length < 1)
      return;
    // TODO: Restore more attributes?
    var [url, data] = recent.pop();
    if (url) {
      // TODO: More pervasive solution (persisting more states, across
      // sessions)
      load_url_in_new_buffer(url, this.window);
      // TODO: Is this the correct way to get the newly created
      // buffer? Can another buffer becomes current before this?
      var current = this.window.buffers.current;
      var browser = current.browser;
      // Restore scroll position after loading
      browser.addEventListener("load", function(event) {
        browser.contentWindow.scroll(data.scrollX, data.scrollY);
      }, true);
    }
  }
});

interactive("ublt-open-last-closed-buffer",
    "Open the last closed buffer",
    function(I) {
      I.window.buffers.open_last_closed();
    });

interactive("ublt-open-closed-buffer",
    "Select a recently closed buffer to re-open",
    function(I) {
      var recent = I.window.buffers.closed_urls;
      if (recent && recent.length > 0) {
        var url = yield I.window.minibuffer.read(
          $prompt = "Restore:",
          $completer = all_word_completer(
            $completions = recent,
            $get_string = function(x) {
              return x ? x[0].toString() : "";
            }
          ),
          $default_completion = recent[recent.length - 1]
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
interactive("switch-to-last-tab",
    "Switch to the last tab",
    function (I) {
      switch_to_buffer(I.window,
                       I.window.buffers.get_buffer(I.window.buffers.count - 1));
    });
interactive("switch-to-last-buffer",
    "Switch to the last visited buffer",
    function (I) {
      switch_to_buffer(I.window,
                       // This is the way to go in newer
                       // conkeror versions
                       I.window.buffers.buffer_history[1]
                       || I.window.buffer);
    });


// Reload/stop reloading all buffers

interactive("stop-loading-all",
    "Stop loading all documents",
    function (I) {
      for (var i = 0; i < I.window.buffers.count; i++) {
        stop_loading(I.window.buffers.get_buffer(i));
      }
    });

interactive("reload-all",
    "Reload all documents",
    function (I) {
      for (var i = 0; i < I.window.buffers.count; i++) {
        reload(I.window.buffers.get_buffer(i));
      }
    });


// Better replacement of built-in buffer switcher

require("minibuffer");

buffer_container.prototype.for_each_history = function(f) {
  var buffers = this.buffer_history.slice(0);
  buffers.push(buffers.shift());
  var count = buffers.length;
  for (var i = 0; i < count; ++i)
    f(buffers[i]);
};

minibuffer.prototype.read_recent_buffer = function () {
  var window = this.window;
  var buffer = this.window.buffers.current;
  keywords(arguments, $prompt = "Buffer:",
           $buffers = function(visitor) window.buffers.for_each_history(visitor),
           $default = buffer,
           $history = "buffer");
  var completer = all_word_completer(
    $completions = arguments.$buffers,
    $get_string = function (x) {
      return "" + x.title || "";
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


provide("ublt-buffer");
