var ublt = ublt || {};

// Just a dirty helper
ublt.add = function(data) {
  for (var prop in data) {
    if (hasOwnProperty.call(data, prop))
      ublt[prop] = data[prop];
  }
};

provide("ublt");
