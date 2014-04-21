/* prismatic.js - Prismatic page-mode for Conkeror

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

define_keymap("prismatic_keymap", $display_name = "prismatic");

define_key(prismatic_keymap, "g", null, $fallthrough);
define_key(prismatic_keymap, "h", null, $fallthrough);
define_key(prismatic_keymap, "d", null, $fallthrough);

define_key(prismatic_keymap, "j", null, $fallthrough);
define_key(prismatic_keymap, "k", null, $fallthrough);

define_keymaps_page_mode("prismatic-mode",
    build_url_regexp($domain = "getprismatic",
                     $tlds = ["com"]),
    { normal: prismatic_keymap },
    $display_name = "Prismatic");

page_mode_activate(prismatic_mode);

provide("prismatic");
