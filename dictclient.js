imports.searchPath.unshift('.');

const IBus = imports.gi.IBus;
const dictsearch = imports.dbsearch;

var dbSearch = new dictsearch.DBSearch ();

function suggest (word,engine){
    
    var sugglist = dbSearch.search(word);
    sugglist.forEach(function(word){
        let wtext = IBus.Text.new_from_string(word);
        engine.lookuptable.append_candidate(wtext);
        engine.update_lookup_table_fast(engine.lookuptable,true);
    });
}
