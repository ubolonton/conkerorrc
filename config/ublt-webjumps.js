// \u21d2 ⇒


// Search
define_webjump("pd", "http://search.pdfchm.net/?q=%s",
               $doc = "\u21d2 pdfchm book search");
define_webjump("yt", "http://www.youtube.com/results?search_query=%s",
               $doc = "\u21d2 Youtube video search");
define_webjump("pr", "http://thepiratebay.se/search/%s",
               $doc = "\u21d2 Pirate Bay torrent search");
define_webjump("lg", "https://encrypted.google.com/search?q=%s%20site%3Alyrigram.com&ie=utf-8&oe=utf-8&aq=t",
               $doc = "\u21d2 Lyrigram lyrics search (Google)");
define_webjump("ly", "https://www.lyrigram.com/search/%s",
               $doc = "\u21d2 Lyrigram lyrics search (Lyrigram)");
define_webjump("coccoc", "http://coccoc.com/result?query=%s",
               $doc = "\u21d2 C\u1ed1c C\u1ed1c");
define_webjump("imdb", "http://www.imdb.com/find?q=%s&s=all",
               $doc = "\u21d2 Internet Movie Database");


// Computer Languages & Systems
define_webjump("cljr", "https://clojars.org/search?q=%s",
               $doc = "\u21d2 Clojars library search");
define_webjump("clj", "http://clojuredocs.org/search?x=0&y=0&q=%s",
               $doc = "\u21d2 Clojure documentation search");
define_webjump("php", "http://www.php.net/manual-lookup.php?pattern=%s&scope=quickref",
               $doc = "\u21d2 PHP documentation search");
define_webjump("js", "https://developer.mozilla.org/en-US/search?q=%s",
               $doc = "\u21d2 Javascript documentation search (Mozila)");
define_webjump("emacswiki", "http://www.google.com/cse?cx=004774160799092323420%3A6-ff2s0o6yi" +
               "&q=%s&sa=Search&siteurl=emacswiki.org%2F",
               $doc = "\u21d2 Emacs Wiki",
               $alternative = "http://www.emacswiki.org/");
define_webjump("mozilla", "http://mxr.mozilla.org/mozilla-central/search?string=%s",
               $doc = "\u21d2 Mozilla cross-referenced source",
               $alternative = "http://mxr.mozilla.org/mozilla-central/source/");
define_webjump("erldocs", "http://erldocs.com?search=%s",
               $doc = "\u21d2 Erlang Documentation",
               $alternative = "http://erldocs.com");


// Dictionaries and translation
define_webjump("ety", "http://www.etymonline.com/index.php?search=%s",
               $doc = "\u21d2 Etymology search");
define_webjump("trans", "http://translate.google.com/translate_t#auto|en|%s",
               $doc = "\u21d2 Google Translate");
define_webjump("thesaurus", "http://www.thefreedictionary.com/%s#Thesaurus",
               $doc = "\u21d2 Thesaurus");
define_webjump("urban", "http://www.urbandictionary.com/define.php?term=%s",
               $doc = "\u21d2 Urban Dictionary");
define_webjump("viet anh", "http://1tudien.com/?w=%s",
               $doc = "\u21d2 Vietnamese-English Dictionary");
define_webjump("wordnik", "https://www.wordnik.com/words/%s",
               $doc = "\u21d2 Wordnik");


// Wikipedia
require("page-modes/wikipedia.js");
wikipedia_didyoumean_follow_first_hit = true;
wikipedia_enable_didyoumean = true;
wikipedia_webjumps_format = "wiki-%s";


// Misc
define_webjump("down?",
               function (url) {
                   if (url) {
                       return "http://downforeveryoneorjustme.com/" + url;
                   } else {
                       return "javascript:window.location.href='http://downforeveryoneorjustme.com/'+window.location.href;";
                   }
               },
               $doc = "\u21d2 Check if a page is down",
               // $argument = "optional",
               $completer = new history_completer($use_history = false,
                                                  $use_bookmarks = true)
              );

// TODO: key for this not webjump
define_webjump("bm",
               function(term) {return term;},
               $completer = new history_completer($use_history = false,
                                                  $use_bookmarks = true),
               $require_match = true,
               $doc = "\u21d2 Visit a conkeror bookmark");

define_webjump("wa", "http://www.wolframalpha.com/input/?i=%s",
               $doc = "\u21d2 Wolfram Alpha query");

define_webjump("mathworld", "http://mathworld.wolfram.com/search/?query=%s&x=0&y=0");



provide("ublt-webjumps");
