// Launchers

require("ublt");
require("ublt-buffer");


ublt.ns("ublt.launcher", {
  // Defines a command that switches to the first buffer that
  // satisfies the checker. If no buffer is found, open the given url
  // in a new buffer instead.
  define: function(name, url, buffer_checker) {
    var dashed_name = name.replace(" ", "-");
    interactive("ublt-launch-" + dashed_name, "Launch " + name, function(I) {
      // TODO: Something better, this is slow
      var buffer_list = I.window.buffers;
      for (let i = 0; i < buffer_list.count; ++i) {
        var b = buffer_list.get_buffer(i);
        // TODO: Does the checker really need to check the whole
        // buffer, or just the uri?
        var found = false;
        try {
          found = buffer_checker(b);
        } catch (ex) {
        }
        if (found) {
          // Load the page if it's not loaded yet (but let
          // content-delay do it if it's loaded though)
          if (!featurep("content-delay") && !ublt.buffer.is_loaded(b)) {
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

  simple: function(name, url) {
    var hostPort = make_uri(url).hostPort;
    ublt.launcher.define(name, url, function(buffer) {
      return hostPort === make_uri(buffer.display_uri_string).hostPort;
    });
  }
});


// Use xbindkeys to assign keys to these
ublt.launcher.simple("GMail", "https://mail.google.com");
ublt.launcher.simple("Facebook", "https://www.facebook.com");
ublt.launcher.simple("Grooveshark", "http://grooveshark.com/#!/ubolonton/collection");
ublt.launcher.simple("Prismatic", "http://preview.getprismatic.com");
ublt.launcher.define("Coursera", "https://www.coursera.org", function(b) {
  return make_uri(b.display_uri_string).hostPort.search("coursera.org") > -1;
});
ublt.launcher.define("Google Reader", "https://www.google.com/reader", function(b) {
  var uri = make_uri(b.display_uri_string);
  return uri.hostPort == "www.google.com" &&
    uri.path.search("/reader") == 0;
});
ublt.launcher.simple("Feedly", "http://cloud.feedly.com/#my");
ublt.launcher.simple("CIAS", "http://cias.cogini.com");

provide("ublt-launchers");
