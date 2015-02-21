require("ublt");

ublt.ns("ublt.capture", {
  save_current_page: function(I) {
    var buffer = I.buffer;
    var window = buffer.browser.contentWindow.wrappedJSObject;
    var document = window.document;
    var url = encodeURIComponent(window.location.href);
    var title = document.title ? encodeURIComponent(document.title) : " ";
    var description = encodeURIComponent(window.getSelection() || "");
    var target = "org-protocol://capture://l/" +
          url + "/" + title + "/" + description;
    // FIX: Register protocol or something.
    // FIX: Proper handling of arguments.
    // FIX: Remove the "sleep" hack
    shell_command_blind("sleep 0.2 && wmctrl -x -a Emacs");
    I.window.minibuffer.message("Sent link to Emacs...");
    var r = yield shell_command('emacsclient "' + target + '"');
    if (r === 0) {
      // TODO: Signal back from Emacs on saving so that Conkeror can
      // kill the buffer. Or do it here if we can figure out how to
      // kill the buffer without Conkeror getting focused.
      // kill_buffer(buffer);
    } else {
      shell_command_blind("wmctrl -x -a Conkeror");
      I.window.minibuffer.message("... Emacs aborted capturing.");
    }
  }
});

interactive(
  "ublt-capture-link",
  "Capture the current page's link in org-mode",
  ublt.capture.save_current_page);

provide("ublt-capture");
