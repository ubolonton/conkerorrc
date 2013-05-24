
// Integration with instapaper.com

function iprl5(document){
    var d = document,
        z = d.createElement('script'),
        b = d.body,
        l = d.location;
    try {
        if(!b)
            throw(0);
        d.title='(Saving...) '+d.title;
        z.setAttribute('src', l.protocol+'//www.instapaper.com/j/pgsycrdh8CSw?u='+encodeURIComponent(l.href)+'&t='+(new Date().getTime()));
        b.appendChild(z);
    } catch(e){
        alert('Please wait until the page has loaded.');
    }
}


function instapaper_readlater(I) {
    var document = I.window.buffers.current.document;
    iprl5(document);
}

interactive("instapaper-read-later",
            "Save current page to instapaper queue.",
           instapaper_readlater);

provide("ublt-instapaper");
