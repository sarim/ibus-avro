imports.searchPath.unshift('.');
const Avroparser = imports.avrolib.OmicronLab.Avro.Phonetic;
const DBus = imports.dbus;
const IBus = imports.gi.IBus;
const utfconv = imports.utf8;

var busname = "omicronlab.avro.dict";
var busadd = '/omicronlab/avro/dict';
var bus = DBus.session;


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
         DBus.session.proxifyObject(this, busname, busadd);
     }

};

DBus.proxifyPrototype(Dict.prototype, DictIface);

let dict = new Dict();


function suggest (word,engine){
    dict.suggestRemote(word,function(sugglist, excp) {
        sugglist.forEach(function(word){
            //let uword = utfconv.utf8Decode(word)
            let wtext = IBus.Text.new_from_string(word);
            engine.lookuptable.append_candidate(wtext);
            engine.update_lookup_table_fast(engine.lookuptable,true);
            });        
      
        });
}
