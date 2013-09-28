require("ublt");

ublt.ns("ublt.diigo", {
    show_toolbar: function(I) {
        var document = I.buffer.document.wrappedJSObject;
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascripts");
        script.setAttribute("src", "https://www.diigo.com/javascripts/webtoolbar/diigolet_b_h_b.js");
        document.body.appendChild(script);
    }
});

interactive("diigo", "Show diigo toolbar", ublt.diigo.show_toolbar);

provide("ublt-diigo");
