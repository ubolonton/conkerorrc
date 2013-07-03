require("ublt");

ublt.ns("ublt.evernote", {
    clip_current_page: function(I) {
        ublt.evernote.clip(I.buffer.browser.contentWindow.wrappedJSObject);
    },

    // window must be unwrapped content window otherwise EN_CLIP_HOST
    // set here will not be accessible by content script
    clip: function(window) {
        var document = window.document;
        // That evernote script seems to depend on this
        window.EN_CLIP_HOST = 'http://www.evernote.com';
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute(
            "src",
            "http://www.evernote.com/public/bookmarkClipper.js?" + (new Date().getTime()/100000));
        document.body.appendChild(script);
    }
});

interactive("evernote-clip-current-page", "Open Evernote's web clipper", ublt.evernote.clip_current_page);

provide("ublt-evernote");
