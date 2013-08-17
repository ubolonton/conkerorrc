/* feedly.js - Feedly page-mode for Conkeror

 Copyright (C) 2013 Nguyễn Tuấn Anh <ubolonton@gmail.com>

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 as published by the Free Software Foundation; either version 2
 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program; if not, write to the Free Software
 Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

 */

require("content-buffer.js");

define_keymap("feedly_keymap", $display_name = "feedly");

// Help
define_key(feedly_keymap, "?", null, $fallthrough);

// Jumping
define_key(feedly_keymap, "g", null, $fallthrough); // gg: search box
define_key(feedly_keymap, "m", null, $fallthrough); // gm: today
define_key(feedly_keymap, "a", null, $fallthrough); // ga: all
define_key(feedly_keymap, "l", null, $fallthrough); // gl: saved

// Navigation
define_key(feedly_keymap, "j", null, $fallthrough);
define_key(feedly_keymap, "k", null, $fallthrough);
define_key(feedly_keymap, "J", null, $fallthrough);
define_key(feedly_keymap, "K", null, $fallthrough);
define_key(feedly_keymap, "n", null, $fallthrough);
define_key(feedly_keymap, "p", null, $fallthrough);

// Application
define_key(feedly_keymap, "a", null, $fallthrough); // add content
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
