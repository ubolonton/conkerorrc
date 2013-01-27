require("element");

var ublt_grooveshark = {
  getBuffer: function(I) {
    var bs = I.window.buffers;
    for (let i = 0; i < bs.count; ++i) {
      var b = bs.get_buffer(i);
      if (b.document.location.hostname == "grooveshark.com") {
        return b;
      }
    }
    return null;
  },

  clickCommand: function(selector) {
    var self = this;
    return function(I) {
      var buffer = self.getBuffer(I);
      if (!buffer)
        return;

      var element = buffer.document.querySelector(selector);
      if (!element)
        return;

      dom_node_click(element, 1, 1);
    };
  }
};

interactive("gs-play-or-pause", "Grooveshark Play or Pause",
            ublt_grooveshark.clickCommand("#play-pause"));
interactive("gs-next", "Grooveshark Next",
            ublt_grooveshark.clickCommand("#play-next"));
interactive("gs-previous", "Grooveshark Next",
            ublt_grooveshark.clickCommand("#play-prev"));
interactive("gs-resume", "Resume",
            ublt_grooveshark.clickCommand("#lightbox-footer a.btn"));

provide("ublt-grooveshark");