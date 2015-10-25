require("keymap");
require("global-overlay-keymap");


// Don't chain aliases
global_overlay_keymap_chain_aliases = false;

// Custom key bindings

// FIX: This comment is obsolete
// OSX:    Command    => A    Option   => M
// Ubuntu: Mod4/Super => A    Alt/Meta => M
modifiers.M = new modifier(function (event) { return event.altKey; },
                           function (event) { event.altKey = true; });

// FIX: Tested only on Linux (and this should be fixed in
// xulrunner/firefox (the problem seems to be xulrunner fucking up
// keypress event (most attributes unset?!?) and keyup/keydown(metaKey
// is never set?!?)). The fix is to use os-key instead of meta key

// // Handle old versions of xulrunner and conkeror
// if (!modifiers.s) {
//   modifiers.s = new modifier(function (event) { return event.metaKey; },
//                              function (event) { event.metaKey = true; });
// }

// XXX: It changed again. Fix Conkeror.
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState.
modifiers.s = new modifier(function(event) {
  if (event.superKey) {
    return true;
  }
  if (!("getModifierState" in event)) {
    return false;
  }
  // XXX: This is OSX only. See above link.
  if (event.getModifierState("Meta")) {
    return true;
  }
  return false;
}, function(event) {
  event.superKey = true;
});

modifier_order = ['C', 'M', 'S', 's'];


// Aliases

// NTA: Many of these are now handled system-wide by `autokey'/'Karabiner', but
// are kept here just in case

// OS X style
define_key_alias("s-c", "M-w");
define_key_alias("s-x", "C-w");
define_key_alias("s-v", "C-y");
define_key_alias("s-z", "C-_");
define_key_alias("s-Z", "C-?");

// Because right pinky is overworked. Really? I would think left pinky
// is often stressed more.
define_key_alias("C-m", "return");

// Dvorak movement
define_key_alias("M-c", "up");
define_key_alias("M-t", "down");
define_key_alias("M-h", "left");
define_key_alias("M-n", "right");
define_key_alias("M-C", "page_up");
define_key_alias("M-T", "page_down");
define_key_alias("M-H", "<");
define_key_alias("M-N", ">");
define_key_alias("M-g", "C-left");
define_key_alias("M-r", "C-right");
define_key_alias("M-G", "home");
define_key_alias("M-R", "end");

// Dvorak deletion
define_key_alias("M-e", "back_space");
define_key_alias("M-u", "delete");
define_key_alias("M-.", "C-back_space");
define_key_alias("M-p", "C-delete");

// "Help" autokey
define_key_alias("C-home", "M-<");
define_key_alias("C-end", "M->");
define_key_alias("home", "C-a");
define_key_alias("end", "C-e");

// Dvorak remaining
define_key_alias("M-i", "C-k");
define_key_alias("M-d", "C-a");
define_key_alias("M-D", "C-e");

// C- M- is much worse than M- M-
define_key_alias("M-space", "C-space");

// This requires my conkeror fork that supports unchained aliases
define_key_alias("M-m", "M-p");
define_key_alias("M-v", "M-n"); // was cmd_scrollPageUp

// define_key_alias("C-t", "C-x");

// Undo some combos globally translated by Karabiner.
define_key_alias("s-left", "C-a");
define_key_alias("s-right", "C-e");
define_key_alias("s-up", "M-<");
define_key_alias("s-down", "M->");
define_key_alias("M-delete", "C-delete");




define_key(default_global_keymap, "s-F", "ublt-toggle-full-screen");

// TODO: define multiple keys in one pass
// OS X conventions
define_key(default_global_keymap, "s-{", "buffer-previous");
define_key(default_global_keymap, "s-}", "buffer-next");
define_key(default_global_keymap, "s-=", "zoom-in-full");
define_key(default_global_keymap, "s--", "zoom-out-full");
define_key(default_global_keymap, "s-t", "find-url-new-buffer");
define_key(default_global_keymap, "s-T", "ublt-open-last-closed-buffer");
define_key(default_global_keymap, "s-`", null, $fallthrough);
define_key(default_global_keymap, "s-tab", null, $fallthrough);
// Uhm, so many keys to waste
define_key(default_global_keymap, "s-k", "kill-current-buffer");
define_key(default_global_keymap, "s-i", "inspect-chrome");
define_key(default_global_keymap, "s-u", "ubolonton-theme");
define_key(default_global_keymap, "s-h", "switch-to-recent-buffer");
define_key(default_global_keymap, "s-g", "caret-mode");
define_key(default_global_keymap, "f6", "colors-toggle");
define_key(default_global_keymap, "f7", "darken-page-mode");
define_key(default_global_keymap, "f8", "toggle-gmail-fixed-width-messages");
define_key(default_global_keymap, "s-n", "switch-to-last-buffer");
define_key(default_global_keymap, "s-i", "instapaper-read-later");
define_key(default_global_keymap, "s-I", "inspect-chrome");
// FIX: Make sure content document doesn't get certain keys instead
define_key(default_global_keymap, "s-N", "switch-to-last-buffer");
define_key(default_global_keymap, "C-G", "stop-loading-all");
define_key(default_global_keymap, "0", "switch-to-last-tab");
define_key(default_global_keymap, "C-M-h", "buffer-previous");
define_key(default_global_keymap, "C-M-n", "buffer-next");
define_key(default_global_keymap, "h", "find-url-from-history-new-buffer");
define_key(default_global_keymap, "H", "find-url-from-history");
define_key(default_global_keymap, "/", "isearch-forward");

define_key(content_buffer_normal_keymap, "s-s", "save-page-complete");
define_key(content_buffer_normal_keymap, "M-f", "follow-new-buffer-background");
define_key(content_buffer_normal_keymap, "s-f", "follow");
define_key(content_buffer_normal_keymap, "s-[", "back");
define_key(content_buffer_normal_keymap, "s-]", "forward");
// define_key(content_buffer_normal_keymap, "R", "readability-arc90");
define_key(content_buffer_normal_keymap, "R", "readability-read-now");
define_key(content_buffer_normal_keymap, "L", "readability-read-later");
define_key(content_buffer_normal_keymap, "s-d", "browser-object-dom-node");
define_key(content_buffer_normal_keymap, "s-D", "toggle-darkened-page");
define_key(content_buffer_normal_keymap, "C-c C-c", "submit-form");
define_key(content_buffer_normal_keymap, "M-s-h", "back");
define_key(content_buffer_normal_keymap, "M-s-n", "forward");
define_key(content_buffer_normal_keymap, "s-a", "cmd_selectAll");
// undefine_key(content_buffer_normal_keymap, "l");
// Don't need find-url, find-alternate-url is enough
undefine_key(content_buffer_normal_keymap, "g");
// Use s-k instead
undefine_key(default_global_keymap, "q");

define_key(content_buffer_normal_keymap, "s-r s-r", "ublt-org-capture-link");
define_key(content_buffer_normal_keymap, "s-r s-t", "ublt-org-capture-talk");
define_key(content_buffer_normal_keymap, "s-r s-a", "ublt-org-capture-article");
define_key(content_buffer_normal_keymap, "s-r s-p", "ublt-org-capture-paper");
define_key(content_buffer_normal_keymap, "s-r s-b", "ublt-org-capture-book");
define_key(content_buffer_normal_keymap, "s-r s-m", "ublt-org-capture-movie");
define_key(content_buffer_normal_keymap, "s-r r", "ublt-org-capture-link");
define_key(content_buffer_normal_keymap, "s-r t", "ublt-org-capture-talk");
define_key(content_buffer_normal_keymap, "s-r a", "ublt-org-capture-article");
define_key(content_buffer_normal_keymap, "s-r p", "ublt-org-capture-paper");
define_key(content_buffer_normal_keymap, "s-r b", "ublt-org-capture-book");
define_key(content_buffer_normal_keymap, "s-r m", "ublt-org-capture-movie");


define_key(content_buffer_normal_keymap, "s-;", "focus");

undefine_key(text_keymap, "M-b");
undefine_key(caret_keymap, "M-b");
define_key(content_buffer_normal_keymap, "M-b", "ublt-fill-current-form");

// Dvorak
define_key(text_keymap, "up", "cmd_scrollLineUp");
define_key(text_keymap, "down", "cmd_scrollLineDown");
define_key(text_keymap, "page_up", "cmd_scrollPageUp");
define_key(text_keymap, "page_down", "cmd_scrollPageDown");
define_key(text_keymap, "home", "scroll-top-left");
define_key(text_keymap, "end", "cmd_scrollBottom");
define_key(text_keymap, "s-a", "cmd_selectAll");

define_key(read_buffer_keymap, "s-I", "inspect-chrome");
define_key(read_buffer_keymap, "C-tab", "minibuffer-complete");
define_key(read_buffer_keymap, "C-S-tab", "minibuffer-complete-previous");
define_key(read_buffer_keymap, "s-return", "minibuffer-complete");
define_key(read_buffer_keymap, "s-S-return", "minibuffer-complete-previous");
define_key(read_buffer_keymap, "s-h", "exit-minibuffer");
// define_key(read_buffer_keymap, "s-n", "exit-minibuffer");
define_key(read_buffer_keymap, "page_up", "minibuffer-complete-previous-page");
define_key(read_buffer_keymap, "page_down", "minibuffer-complete-next-page");

call_after_load("gmail", function() {
  define_key(gmail_keymap, "v", null, $fallthrough);
  define_key(gmail_keymap, "space", null, $fallthrough);
  define_key(gmail_keymap, "S-space", null, $fallthrough);
  define_key(gmail_keymap, "page_up", null, $fallthrough);
  define_key(gmail_keymap, "page_down", null, $fallthrough);
});


// Use numeric key to switch buffers
function define_switch_buffer_key (key, buf_num) {
  define_key(default_global_keymap, key,
             function (I) {
               switch_to_buffer(I.window,
                                I.window.buffers.get_buffer(buf_num));
             });
}

for (let i = 0; i < 9; ++i) {
    define_switch_buffer_key(String((i+1)%10), i);
}



provide("ublt-dvorak");
