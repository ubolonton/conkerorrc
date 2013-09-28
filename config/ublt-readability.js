// Integration with readability.com

var readability_token = 'u3UkrgRbELzG4mM5CGBEnu2qLMVC8JNnxXd76Mtc';

function readability_read_now(I) {
    var window = I.window.buffers.current;
    var document = window.document;
    ((function(){
        window.baseUrl = 'http://www.readability.com';
        window.readabilityToken = readability_token;
        var s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('charset', 'UTF-8');
        s.setAttribute('src', window.baseUrl + '/bookmarklet/read.js');
        document.documentElement.appendChild(s);
    })());
}

function readability_read_later(I) {
    var window = I.window.buffers.current;
    var document = window.document;
    ((function(){
        window.baseUrl = 'http://www.readability.com';
        window.readabilityToken = readability_token;
        var s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('charset', 'UTF-8');
        s.setAttribute('src', window.baseUrl + '/bookmarklet/save.js');
        document.documentElement.appendChild(s);
    })());
}

interactive("readability-read-now", null, readability_read_now);
interactive("readability-read-later", null, readability_read_later);

provide("ublt-readability");
