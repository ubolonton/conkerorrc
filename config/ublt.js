var ublt = ublt || {};

(function(ublt) {
  var global = this;

  // For external libraries, which don't use Conkeror module system,
  // e.g. underscore
  ublt.require = function(module) {
    require(module);
    if (!featurep(module))
      provide(module);
  };

  // Returns the namespace named by path, creating missing segments
  // (separator is "." by default)
  ublt.get_ns = function(path, do_not_create, separator) {
    var s = separator || ".";
    var segments = path.split(s);
    var parent_path = segments.slice(0, -1).join(s);
    var current = segments[segments.length - 1];
    var type;

    var parent = segments.length === 1 ? global : ublt.get_ns(parent_path);

    type = (typeof parent);
    if (type !== "object")
      throw new TypeError(parent_path + " is a " + type);

    if (!do_not_create)
      parent[current] = parent[current] || {};

    type = (typeof parent[current]);
    if (parent[current] !== undefined &&
        type !== "object")
      throw new TypeError(path + " is a " + type);

    return parent[current];
  };

}).call(this, ublt);

// ublt.ns("ublt.mouse", {onclick: function() {...}})
ublt.require("underscore");
ublt.ns = function(path, extension) {
  // XXX FIX: _.extend is non-recursive ($.extend is more sensible but
  // jQuery does not seem to work outside of the browser yet)
  return _.extend(ublt.get_ns(path), extension);
};

ublt.ns("ublt", {
  // // Not recursive
  // merge: function(obj, data) {
  //   for (var prop in data) {
  //     if (hasOwnProperty.call(data, prop))
  //       obj[prop] = data[prop];
  //   }
  //   return obj;
  // },

  // add: function(data) {
  //   ublt.merge(this, data);
  // },

  mask: function(value, mask) {
    return (value & mask) === mask;
  }
});

provide("ublt");
