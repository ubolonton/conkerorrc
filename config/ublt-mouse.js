/* ublt-mouse.js -- A mouse gesture module for Conkeror

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

require("ublt");
require("keymap");
ublt.require("underscore");

// Gesture-to-command mapping
ublt.ns("ublt.mouse.map", {
  // "r-mouse1"    : "switch-to-last-buffer",
  // "l-mouse3"    : "toggle-dark-mode",
  // "C-mouse2"    : "zoom-reset-text",
  // "s-wheeldown" : "forward",
  // "s-wheelup"   : "back",
  // "l-wheeldown" : "buffer-next",
  // "l-wheelup"   : "buffer-previous"
});

// This is a with-modification rip-off of keymap.js
// FIX TODO: Don't monkey patch
ublt.ns("ublt.mouse.combo", {
  modifier_order: ["l", "r", "m"],

  // event.buttons are not actually "modifiers", so some dance is
  // needed to avoid things like "l-mouse1" or "r-mouse3"
  modifiers: (let (BUTTONS = {
    LEFT: 1, RIGHT: 2, MIDDLE: 4, FORTH: 8, FIFTH: 16
  }, BUTTON = {
    LEFT: 0, MIDDLE: 1, RIGHT: 2
  }) {
    l: new modifier(function(event) { return ["mousedown", "mouseup", "click", "wheel"].indexOf(event.type) > -1 &&
                               (event.ublt_mouse_l || ublt.mask(event.buttons, BUTTONS.LEFT)) &&
                               (event.type === "wheel" || event.button !== BUTTON.LEFT); },
                    function(event) { event.ublt_mouse_l = true; }),
    r: new modifier(function(event) { return ["mousedown", "mouseup", "click", "wheel"].indexOf(event.type) > -1 &&
                               (event.ublt_mouse_r || ublt.mask(event.buttons, BUTTONS.RIGHT)) &&
                               (event.type === "wheel" || event.button !== BUTTON.RIGHT); },
                    function(event) { event.ublt_mouse_r = true; }),
    m: new modifier(function(event) { return ["mousedown", "mouseup", "click", "wheel"].indexOf(event.type) > -1 &&
                               (event.ublt_mouse_m || ublt.mask(event.buttons, BUTTONS.MIDDLE)) &&
                               (event.type === "wheel" || event.button !== BUTTON.MIDDLE); },
                    function(event) { event.ublt_mouse_m = true; })
  }),

  monkey_patch_key_map: function() {
    _.extend(modifiers, this.modifiers);
    this.modifier_order.forEach(function(M) {
      if (modifier_order.indexOf(M) < 0) {
        modifier_order.push(M);
      }
    });
  },

  monkey_unpatch_key_map: function() {
    _(this.modifiers).each(function(m, M) {
      delete modifiers[M];
    });
    this.modifier_order.forEach(function(M) {
      modifier_order = _(modifier_order).without(M);
    });
  },

  format: function(event) {
    var combo = format_key_combo(event);
    if (event.type === "wheel") {
      var i = _(combo).lastIndexOf("-") + 1;
      combo = combo.substring(0, i);
      if (event.deltaY > 0)
        combo += "wheeldown";
      else if (event.deltaY < 0)
        combo += "wheelup";
    }
    return combo;
  },

  unformat: function(combo) {
    var event = unformat_key_combo(combo);
    var i = _(combo).lastIndexOf("-") + 1;
    var name = combo.substring(i);
    if (name === "wheeldown") {
      event.type = "wheel";
      event.deltaY = -3;
    } else if (name === "wheelup") {
      event.type = "wheel";
      event.deltaY = 3;
    }
    return event;
  }
});

ublt.ns("ublt.mouse.handler", {
  silence: function(event) {
    event.preventDefault();
    event.stopPropagation();
  },

  // If there is a registered handler for the event, don't let other
  // have the chance to process it
  maybe_silence: function(event) {
    var combo = ublt.mouse.combo.format(event);
    var handler = ublt.mouse.map[combo];
    if (handler)
      this.silence(event);
  },

  // TODO: use keymaps (somehow determine a "current" one)
  maybe_handle: function(context, event) {
    var combo = ublt.mouse.combo.format(event);
    var handler = ublt.mouse.map[combo];
    if (handler) {
      var window = context.ownerDocument.defaultView;
      var buffer = window.buffers.current;
      var I = new interactive_context(buffer);
      this.silence(event);
      co_call(call_interactively(I, handler));
    }
  }
});

ublt.ns("ublt.mouse.listener", {
  onmousedown: function(event) {
    // TODO: start drawing gestures here
    ublt.mouse.handler.maybe_silence(event);
  },

  onmouseup: function(event) {
    // TODO: compute & handle drawing gestures here
    ublt.mouse.handler.maybe_silence(event);
  },

  onclick: function(event) {
    ublt.mouse.handler.maybe_handle(this, event);
  },

  onwheel: function(event) {
    ublt.mouse.handler.maybe_handle(this, event);
  },

  add_all: function(buffer) {
    ["mousedown", "mouseup", "click", "wheel"].forEach(function(event) {
      buffer.browser.addEventListener(event, ublt.mouse.listener["on" + event], true);
    });
  },

  remove_all: function(buffer) {
    ["mousedown", "mouseup", "click", "wheel"].forEach(function(event) {
      buffer.browser.removeEventListener(event, ublt.mouse.listener["on" + event], true);
    });
  }
});

// Mode declarations

function ublt_mouse_mode_enable() {
  ublt.mouse.combo.monkey_patch_key_map();
  add_hook("create_buffer_hook", ublt.mouse.listener.add_all);
  for_each_buffer(ublt.mouse.listener.add_all);
}

function ublt_mouse_mode_disable() {
  ublt.mouse.combo.monkey_unpatch_key_map();
  remove_hook("create_buffer_hook", ublt.mouse.listener.add_all);
  for_each_buffer(ublt.mouse.listener.remove_all);
}

define_global_mode("ublt_mouse_mode",
                   ublt_mouse_mode_enable,
                   ublt_mouse_mode_disable);

ublt_mouse_mode(true);



provide("ublt-mouse");
