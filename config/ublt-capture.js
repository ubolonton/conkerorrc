require("ublt");

ublt.ns("ublt.capture", {
  current_page: function(I, template) {
    var buffer = I.buffer;
    var window = buffer.browser.contentWindow.wrappedJSObject;
    var document = window.document;
    var url = encodeURIComponent(window.location.href);
    var title = document.title ? encodeURIComponent(document.title) : " ";
    var description = encodeURIComponent(window.getSelection() || "");
    var target = "org-protocol://capture://" + template + "/" +
          url + "/" + title + "/" + description;
    // FIX: Register protocol or something.
    // FIX: Proper handling of arguments.
    // FIX: Remove the "sleep" hack
    shell_command_blind("sleep 0.2 && wmctrl -x -a Emacs");
    I.window.minibuffer.message("Sent link to Emacs...");
    var r = yield shell_command('emacsclient "' + target + '"');
    if (r === 0) {
      // Do nothing. Let Emacs control Conkeror when it aborts/confirms.
    } else {
      shell_command_blind("wmctrl -x -a Conkeror");
      I.window.minibuffer.message("... Emacs rejected capturing.");
    }
  }
});

interactive(
  "ublt-org-capture-link",
  "Save the current page's link in org-mode", function(I) {
    yield ublt.capture.current_page(I, "xl");
  });

interactive(
  "ublt-org-capture-talk",
  "Save the current page's talk in org-mode for later watching", function(I) {
    yield ublt.capture.current_page(I, "xt");
  });

interactive(
  "ublt-org-capture-article",
  "Save the current page's article in org-mode for later reading", function(I) {
    yield ublt.capture.current_page(I, "xa");
  });

interactive(
  "ublt-org-capture-paper",
  "Save the current page's paper in org-mode for later reading", function(I) {
    yield ublt.capture.current_page(I, "xp");
  });

interactive(
  "ublt-org-capture-book",
  "Save the current page's book in org-mode for later reading", function(I) {
    yield ublt.capture.current_page(I, "xb");
  });

interactive(
  "ublt-org-capture-movie",
  "Save the current page's movie in org-mode for later watching", function(I) {
    yield ublt.capture.current_page(I, "xm");
  });

provide("ublt-capture");
