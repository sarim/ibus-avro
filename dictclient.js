/*
    =============================================================================
    *****************************************************************************
    The contents of this file are subject to the Mozilla Public License
    Version 1.1 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License at
    http://www.mozilla.org/MPL/

    Software distributed under the License is distributed on an "AS IS"
    basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
    License for the specific language governing rights and limitations
    under the License.

    The Original Code is ibus-avro

    The Initial Developer of the Original Code is
    Sarim Khan <sarim2005@gmail.com>

    Copyright (C) Sarim Khan (http://www.sarimkhan.com). All Rights Reserved.


    Contributor(s): ______________________________________.

    *****************************************************************************
    =============================================================================
*/


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
