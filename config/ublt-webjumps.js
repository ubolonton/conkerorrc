// \u21d2 ⇒


// Search
define_webjump("pd", "http://search.pdfchm.net/?q=%s",
               $description = "\u21d2 pdfchm book search");
define_webjump("yt", "http://www.youtube.com/results?search_query=%s",
               $description = "\u21d2 Youtube video search");
define_webjump("pr", "http://thepiratebay.se/search/%s",
               $description = "\u21d2 Pirate Bay torrent search");
define_webjump("ly", "https://encrypted.google.com/search?q=%s%20site%3Alyrigram.com&ie=utf-8&oe=utf-8&aq=t",
               $description = "\u21d2 Lyrigram lyrics search (Google)");
define_webjump("lg", "https://www.lyrigram.com/search/%s",
               $description = "\u21d2 Lyrigram lyrics search (Lyrigram)");
define_webjump("coccoc", "http://coccoc.com/result?query=%s",
               $description = "\u21d2 C\u1ed1c C\u1ed1c");


// Languages
define_webjump("cljr", "https://clojars.org/search?q=%s",
               $description = "\u21d2 Clojars library search");
define_webjump("clj", "http://clojuredocs.org/search?x=0&y=0&q=%s",
               $description = "\u21d2 Clojure documentation search");
define_webjump("php", "http://www.php.net/manual-lookup.php?pattern=%s&scope=quickref",
               $description = "\u21d2 PHP documentation search");
define_webjump("js", "https://developer.mozilla.org/en-US/search?q=%s",
               $description = "\u21d2 Javascript documentation search (Mozila)");
define_webjump("emacswiki", "http://www.google.com/cse?cx=004774160799092323420%3A6-ff2s0o6yi" +
               "&q=%s&sa=Search&siteurl=emacswiki.org%2F",
               $description = "\u21d2 Emacs Wiki",
               $alternative = "http://www.emacswiki.org/");


// Dictionaries and translation
define_webjump("ety", "http://www.etymonline.com/index.php?search=%s",
               $description = "\u21d2 Etymology search");
define_webjump("trans", "http://translate.google.com/translate_t#auto|en|%s",
               $description = "\u21d2 Google Translate");
define_webjump("thesaurus", "http://www.thefreedictionary.com/%s#Thesaurus",
               $description = "\u21d2 Thesaurus");
define_webjump("urban", "http://www.urbandictionary.com/define.php?term=%s",
               $description = "\u21d2 Urban Dictionary");


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
               $description = "\u21d2 Check if a page is down",
               $argument = "optional",
               $completer = history_completer($use_history = false,
                                              $use_bookmarks = true)
              );

// TODO: key for this not webjump
define_webjump("bm",
               function(term) {return term;},
               $completer = history_completer($use_history = false,
                                              $use_bookmarks = true,
                                              $match_required = true),
               $description = "\u21d2 Visit a conkeror bookmark");

define_webjump("wa", "http://www.wolframalpha.com/input/?i=%s",
               $description = "\u21d2 Wolfram Alpha query");



provide("ublt-webjumps");
