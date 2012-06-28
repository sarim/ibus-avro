#!/usr/bin/env gjs


imports.searchPath.unshift('.');
const eevars = imports.evars;
const DbServer = imports.db;
const RegexServer = imports.avroregexlib;
const utfconv = imports.utf8;

function DBSearch () {
    this._init();
}

DBSearch.prototype = {
    
	search: function (enText) {
        var pattern = this._regex.parse(enText);
        pattern = '^' + pattern + '$';
        var retWords = [];
        retWords = this._searchInArray(pattern, this._db.w_k);
        return retWords;
  	},
  	
  	
  	_searchInArray: function(pattern, wArray){
        var retWords = [];
        var re = new RegExp(pattern);
        for (w in wArray){
            if (re.test(wArray[w])){
                retWords.push(wArray[w]);
            }
        }
  	    return retWords;
  	},


	_printWords: function (enText) {
	    var words = this.search(enText);
	    for (w in words){
            print(words[w]);
        }
  	},


	_init: function () {
        this._db = new DbServer.DB();
        this._db.loadDb ();
        this._regex = new RegexServer.AvroRegex();
  	}
}


/* --------- */
/* Test code */
/* --------- */
var __dbSearch = new DBSearch ();
__dbSearch._printWords('kortobbo');