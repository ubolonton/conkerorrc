require("ublt");

// FIX: Somehow xulrunner's built-in password autofill is broken on
// recent versions. There should be a proper fix. This module should
// only be a temporary workaround.

// TODO: non-global mode (so that it can be enabled/disabled per-buffer)

// TODO: Clear password field if no match found

ublt.ns("ublt.login", {
  get_containing_form: function(element) {
    var el = element.parentNode;
    while (el && el.tagName != "FORM") {
      el = el.parentNode;
    }
    return el;
  },

  fill_form: function(form) {
    if (form) {
      var lm = Cc["@mozilla.org/login-manager;1"]
            .getService(Ci.nsILoginManager);
      return lm.fillForm(form);
    }
    return false;
  },

  fill_current_form: function(I) {
    var form = ublt.login.get_containing_form(I.buffer.focused_element);
    return ublt.login.fill_form(form);
  },

  fill_containing_form: function(event) {
    var form = ublt.login.get_containing_form(event.target);
    return ublt.login.fill_form(form);
  },

  get_interesting_elements: function(doc) {
    return _.filter(doc.getElementsByTagName("input"), function(el) {
      return _.include(["text", "email"], el.type);
    });
  },

  enable_autofill: function(buffer) {
    var doc = buffer.document;
    _.each(ublt.login.get_interesting_elements(doc), function(el) {
      el.addEventListener("blur", ublt.login.fill_containing_form, false);
      el.addEventListener("change", ublt.login.fill_containing_form, false);
    });
  },

  disable_autofill: function(buffer) {
    var doc = buffer.document;
    _.each(ublt.login.get_interesting_elements(doc), function(el) {
      el.removeEventListener("blur", ublt.login.fill_containing_form, false);
      el.removeEventListener("change", ublt.login.fill_containing_form, false);
    });
  }
});

interactive("ublt-fill-current-form", "Use login manager to fill"
            + " the currently focused form", ublt.login.fill_current_form);

define_global_mode(
  "ublt_login_autofill_mode",
  function enable() {
    add_hook("content_buffer_finished_loading_hook", ublt.login.enable_autofill);
    for_each_buffer(function(buffer) {
      ublt.login.enable_autofill(buffer);
    });
  },
  function disable() {
    remove_hook("content_buffer_finished_loading_hook", ublt.login.enable_autofill);
    for_each_buffer(function(buffer) {
      ublt.login.disable_autofill(buffer);
    });
  });

provide("ublt-login");
