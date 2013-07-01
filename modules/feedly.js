require("content-buffer.js");

define_keymap("feedly_keymap", $display_name = "feedly");

// Help
define_key(feedly_keymap, "?", null, $fallthrough);

// Jumping
define_key(feedly_keymap, "g", null, $fallthrough);
define_key(feedly_keymap, "m", null, $fallthrough);
define_key(feedly_keymap, "a", null, $fallthrough);
define_key(feedly_keymap, "l", null, $fallthrough);

// Navigation
define_key(feedly_keymap, "j", null, $fallthrough);
define_key(feedly_keymap, "k", null, $fallthrough);
define_key(feedly_keymap, "J", null, $fallthrough);
define_key(feedly_keymap, "K", null, $fallthrough);
define_key(feedly_keymap, "n", null, $fallthrough);
define_key(feedly_keymap, "p", null, $fallthrough);

// Application
define_key(feedly_keymap, "a", null, $fallthrough); // add
define_key(feedly_keymap, "r", null, $fallthrough); // refresh

// Acting
define_key(feedly_keymap, "v", null, $fallthrough); // view
define_key(feedly_keymap, "m", null, $fallthrough); // mark read/unread
define_key(feedly_keymap, "x", null, $fallthrough); // minimize
define_key(feedly_keymap, "s", null, $fallthrough); // save
define_key(feedly_keymap, "b", null, $fallthrough); // buffer
define_key(feedly_keymap, "V", null, $fallthrough); // preview
define_key(feedly_keymap, "A", null, $fallthrough); // all read
define_key(feedly_keymap, "o", null, $fallthrough); // open/close

define_keymaps_page_mode("feedly-mode",
    build_url_regexp($domain = "cloud.feedly",
                     $tlds = ["com"]),
    { normal: feedly_keymap },
    $display_name = "Feedly");

page_mode_activate(feedly_mode);

provide("feedly");
