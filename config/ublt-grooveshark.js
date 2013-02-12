require("element");
require("ublt");

ublt.ns("ublt.grooveshark", {
  get_buffer: function(I) {
    var bs = I.window.buffers;
    for (let i = 0; i < bs.count; ++i) {
      var b = bs.get_buffer(i);
      if (b.document.location.hostname == "grooveshark.com") {
        return b;
      }
    }
    return null;
  },

  click_command: function(selector) {
    var self = this;
    return function(I) {
      var buffer = self.get_buffer(I);
      if (!buffer)
        return;

      // Dismiss the reminder first if it's there
      var resume_button = buffer.document.querySelector("#lightbox-footer a.btn");
      if (resume_button)
        dom_node_click(resume_button);

      var element = buffer.document.querySelector(selector);
      if (!element)
        return;

      dom_node_click(element, 1, 1);
    };
  }
});


interactive("gs-play-or-pause", "Grooveshark Play or Pause",
            ublt.grooveshark.click_command("#play-pause"));
interactive("gs-next", "Grooveshark Next",
            ublt.grooveshark.click_command("#play-next"));
interactive("gs-previous", "Grooveshark Next",
            ublt.grooveshark.click_command("#play-prev"));
interactive("gs-resume", "Resume",
            ublt.grooveshark.click_command("#lightbox-footer a.btn"));

provide("ublt-grooveshark");
