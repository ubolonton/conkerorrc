require("ublt");


function m_class(el) {
  var cl = el.getAttribute("class");
  cl = cl ? cl.split(" ")[0] : "";
  return cl ? "." + cl : "";
}

function m_id(el) {
  var id = el.getAttribute("id");
  return id ? "#" + id : "";
}

function css_selector(el) {
  var e = el;
  var sel = [];
  while (e && e.tagName != "BODY") {
    sel.push(e.tagName.toLowerCase() + m_id(e) + m_class(e));
    e = e.parentElement;
  }
  return sel.reverse().join(" ");
}

function pp(obj, all) {
  var l = [];
  for (var p in obj)
    if (all || Object.hasOwnProperty.call(obj, p))
      l.push(p + ": " + obj[p]);
  return l.join("\n");
}

function pl(obj, all) {
  var l = [];
  for (var p in obj)
    if (all || Object.hasOwnProperty.call(obj, p))
      l.push(p);
  return l.join("\n");
}

function pc(obj, all) {
  var count = 0;
  for (var p in obj)
    if (all || Object.hasOwnProperty.call(obj, p))
      count ++;
  return count;
}

function contentW() {
  return repl_context().window.buffers.current.browser.contentWindow;
}

function w() {
    return repl_context().window;
}

// This doesn't work yet for some reason related to EXPORTED_SYMBOLS
let (require = function(module) {
    var temp = {
        require: require,
        exports: {},
    };
    Components.utils.import(module, temp);
    return temp.exports;
}) {
    ublt.ns("ublt.commonjs", {
        require: require
    });
};


provide("ublt-util");
