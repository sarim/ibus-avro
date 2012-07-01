imports.searchPath.unshift('.');
const eevars = imports.evars;
const dblib = imports.dbsearch;
const DBus = imports.dbus;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Mainloop = imports.mainloop;

let busname = "omicronlab.avro.dict";
let busadd = '/omicronlab/avro/dict';
let bus = DBus.session;


const DictIface = {
name: busname,
methods: [{
            name: 'suggest',
            inSignature: 's',
            outSignature: 'as'
          }
       ],
properties: []
};

function Dict() {
this._init();
}

Dict.prototype = {
_init: function() {
    this.__dbSearch = new dblib.DBSearch();
    DBus.session.exportObject(busadd, this);
    DBus.conformExport(Dict.prototype, DictIface);
    print("Dictionary loaded, listening on DBus");
},

suggest: function(word) {
    print("Got request for " + word );
    let wordlist = this.__dbSearch.search(word);
    print("Sending reply");
    print(wordlist);
    return wordlist;
}
}; 

dict = new Dict();

DBus.session.acquire_name(busname, 0, null, null);

Mainloop.run('dictmainloop');
