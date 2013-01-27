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

// Handle old versions of xulrunner and conkeror
if (!modifiers.s) {
  modifiers.s = new modifier(function (event) { return event.metaKey; },
                             function (event) { event.metaKey = true; });
}

modifier_order = ['C', 'M', 'S', 's'];


// Aliases

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
define_key(default_global_keymap, "s-k", "ublt-kill-current-buffer");
define_key(default_global_keymap, "s-i", "inspect-chrome");
define_key(default_global_keymap, "s-u", "ubolonton-theme");
define_key(default_global_keymap, "s-h", "switch-to-recent-buffer");
define_key(default_global_keymap, "s-g", "caret-mode");
define_key(default_global_keymap, "f6", "colors-toggle");
define_key(default_global_keymap, "f7", "darken-page-mode");
define_key(default_global_keymap, "f8", "toggle-gmail-fixed-width-messages");
define_key(default_global_keymap, "s-n", "switch-to-last-buffer");
define_key(default_global_keymap, "C-G", "stop-loading-all");
define_key(default_global_keymap, "0", "switch-to-last-tab");
define_key(default_global_keymap, "C-M-h", "buffer-previous");
define_key(default_global_keymap, "C-M-n", "buffer-next");
define_key(default_global_keymap, "h", "find-url-from-history-new-buffer");
define_key(default_global_keymap, "H", "find-url-from-history");

define_key(content_buffer_normal_keymap, "s-s", "save-page-complete");
define_key(content_buffer_normal_keymap, "M-f", "follow-new-buffer-background");
define_key(content_buffer_normal_keymap, "s-f", "follow");
define_key(content_buffer_normal_keymap, "s-[", "back");
define_key(content_buffer_normal_keymap, "s-]", "forward");
define_key(content_buffer_normal_keymap, "R", "readability_arc90");
define_key(content_buffer_normal_keymap, "s-d", "toggle-darkened-page");
define_key(content_buffer_normal_keymap, "s-r", "save-for-later");
define_key(content_buffer_normal_keymap, "C-c C-c", "submit-form");
define_key(content_buffer_normal_keymap, "M-s-h", "back");
define_key(content_buffer_normal_keymap, "M-s-n", "forward");

// Dvorak
define_key(text_keymap, "up", "cmd_scrollLineUp");
define_key(text_keymap, "down", "cmd_scrollLineDown");
define_key(text_keymap, "page_up", "cmd_scrollPageUp");
define_key(text_keymap, "page_down", "cmd_scrollPageDown");
define_key(text_keymap, "home", "scroll-top-left");
define_key(text_keymap, "end", "cmd_scrollBottom");
define_key(text_keymap, "s-a", "cmd_selectAll");

define_key(read_buffer_keymap, "s-i", "inspect-chrome");
define_key(read_buffer_keymap, "C-tab", "minibuffer-complete");
define_key(read_buffer_keymap, "C-S-tab", "minibuffer-complete-previous");
define_key(read_buffer_keymap, "s-return", "minibuffer-complete");
define_key(read_buffer_keymap, "s-S-return", "minibuffer-complete-previous");
define_key(read_buffer_keymap, "s-h", "exit-minibuffer");
define_key(read_buffer_keymap, "s-h", "exit-minibuffer");
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