var ublt = ublt || {};

(function(ublt) {
  // Just dirty helpers

  // Not recursive
  function merge(obj, data) {
    for (var prop in data) {
      if (hasOwnProperty.call(data, prop))
        obj[prop] = data[prop];
    }
    return obj;
  }

  ublt.add = function(data) {
    merge(this, data);
  };

  ublt.merge = merge;
})(ublt);

provide("ublt");
