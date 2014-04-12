require("content-buffer");

define_keymap("_9gag_keymap", $display_name = "_9gag");

define_key(_9gag_keymap, "j", null, $fallthrough);
define_key(_9gag_keymap, "k", null, $fallthrough);

define_keymaps_page_mode("_9gag-mode",
    build_url_regexp($domain = "9gag",
                     $tlds = ["com"]),
    { normal: _9gag_keymap },
    $display_name = "9gag");

page_mode_activate(_9gag_mode);

provide("_9gag");
