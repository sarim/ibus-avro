#!/usr/bin/env gjs

imports.searchPath.unshift('.');
const IBus = imports.gi.IBus;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Avroparser = imports.avrolib.OmicronLab.Avro.Phonetic;
const utfconv = imports.utf8;
const eevars = imports.evars;
const dictdb = imports.dictclient;

//check if running from ibus
exec_by_ibus = (ARGV[0] == '--ibus')

// Let's initialize ibus
IBus.init();

//get the ibus bus
var bus = new IBus.Bus();

if (bus.is_connected()) {

    var id = 0;

    function _create_engine_cb(factory, engine_name) {

        id += 1;
        var engine = new IBus.Engine({
            engine_name: engine_name,
            object_path: '/org/freedesktop/IBus/Engine/' + id,
            connection: bus.get_connection()
        });

        engine.connect('process-key-event', function (engine, keyval, keycode, state) {

            //print keypress infos, helpful for debugging
            print(keyval + " " + keycode + " " + state);

            // ignore release event
            if (!(state == 0 || state == 1 || state == 16 || state == 17)) {
                return false;
            }

            // capture the shift key
            if (keycode == 42) {
                return true;
            }

            // process letter key events
            if (keyval >= 33 && keyval <= 126) {
                engine.buffertext += IBus.keyval_to_unicode(keyval);
                let bntext = Avroparser.parse(engine.buffertext);
                bntext = utfconv.utf8Decode(bntext);
                let text = IBus.Text.new_from_string(bntext);
                engine.update_preedit_text(text, bntext.length, true);

                let entext = IBus.Text.new_from_string(engine.buffertext);
                engine.update_auxiliary_text(entext, true);
                engine.lookuptable.clear();
                engine.lookuptable.append_candidate(text);
                engine.update_lookup_table_fast(engine.lookuptable,true);
                dictdb.suggest(engine.buffertext,engine);
           
                
                return true;
            } else if (keyval == IBus.Return || keyval == IBus.space) {

                let selectedindex = engine.lookuptable.get_cursor_pos();
                let text = engine.lookuptable.get_candidate(selectedindex);
                engine.commit_text(text);
                engine.buffertext = "";
                engine.lookuptable.clear();
                engine.hide_preedit_text();
                engine.hide_auxiliary_text();
                engine.hide_lookup_table();

                if (keyval == IBus.space) {
                    engine.commit_text(IBus.Text.new_from_string(" "));
                    return true;
                }

            } else if (keyval == IBus.BackSpace) {
                if (engine.buffertext.length > 0) {
                    engine.buffertext = engine.buffertext.substr(0, engine.buffertext.length - 1);
                    let bntext = Avroparser.parse(engine.buffertext);
                    bntext = utfconv.utf8Decode(bntext);
                    let text = IBus.Text.new_from_string(bntext);
                    engine.update_preedit_text(text, bntext.length, true);
                    let entext = IBus.Text.new_from_string(engine.buffertext);
                    engine.update_auxiliary_text(entext, true);
                    engine.lookuptable.clear();
                    engine.lookuptable.append_candidate(text);
                    engine.update_lookup_table_fast(engine.lookuptable,true);
                    dictdb.suggest(engine.buffertext,engine);
                    return true;
                }
                
            } else if (keyval == IBus.Up || keyval == IBus.Down) {
                if (engine.lookuptable.get_number_of_candidates() != 0){                    
                    if (keyval == IBus.Up) {
                    engine.lookuptable.cursor_up();
                    engine.update_lookup_table_fast(engine.lookuptable,true);
                    }
                    else if (keyval == IBus.Down) {
                    engine.lookuptable.cursor_down();
                    engine.update_lookup_table_fast(engine.lookuptable,true);
                    }
                }
           
            } else if (keyval == IBus.Left || keyval == IBus.Right || keyval == IBus.Control_L || keyval == IBus.Control_R || keyval == IBus.Insert || keyval == IBus.Delete || keyval == IBus.Home || keyval == IBus.Page_Up || keyval == IBus.Page_Down || keyval == IBus.End || keyval == IBus.Alt_L || keyval == IBus.Alt_R) {
                let selectedindex = engine.lookuptable.get_cursor_pos();
                let text = engine.lookuptable.get_candidate(selectedindex);
                engine.commit_text(text);
                engine.buffertext = "";
                engine.lookuptable.clear();
                engine.hide_preedit_text();
                engine.hide_auxiliary_text();
                engine.hide_lookup_table();
            }
            return false;
        });

        engine.connect('candidate-clicked', function (engine,index,button,state) {
            if (engine.buffertext.length > 0) {
                
                print("candidate clicked: " + index + " " + button + " " + state);
                let text = engine.lookuptable.get_candidate(index);
                engine.commit_text(text);
                engine.buffertext = "";
                engine.lookuptable.clear();
                engine.hide_preedit_text();
                engine.hide_auxiliary_text();
                engine.hide_lookup_table();
            }
            
        });
        
        engine.connect('focus-out', function () {
            if (engine.buffertext.length > 0) {
                let bntext = Avroparser.parse(engine.buffertext);
                bntext = utfconv.utf8Decode(bntext);
                let text = IBus.Text.new_from_string(bntext);
                engine.commit_text(text);
                engine.buffertext = "";
                engine.hide_preedit_text();
                engine.hide_auxiliary_text();
            }
        });
        

        engine.buffertext = "";
        engine.lookuptable = IBus.LookupTable.new(7,0,true,true);
        return engine;
    }

    var factory = IBus.Factory.new(bus.get_connection());
    //factory.add_engine("avro-phonetic",GObject.type_from_name('IBusEngine'));
    factory.connect('create-engine', _create_engine_cb);
    var component = new IBus.Component({
        name: "org.freedesktop.IBus.Avro",
        description: "Avro phonetic",
        version: "0.9",
        license: "MPL",
        author: "Sarim Khan <sarim2005@gmail.com>",
        homepage: "https://github.com/sarim/ibus-avro",
        exec: eevars.get_libexecdir() + "/main-gjs.js",
        textdomain: "avro-phonetic"
    });

    var avroenginedesc = new IBus.EngineDesc({
        name: "avro-phonetic",
        longname: "avro phonetic",
        description: "Avro Phonetic Engine",
        language: "bn",
        license: "MPL",
        author: "Sarim Khan <sarim2005@gmail.com>",
        icon: eevars.get_pkgdatadir() + "/avro-bangla.png",
        layout: "bn"
    });

    component.add_engine(avroenginedesc);
    if (exec_by_ibus) {
        bus.request_name("org.freedesktop.IBus.Avro", 0);
    } else {
        bus.register_component(component);
    }
    IBus.main();
}
else
    print("Exiting because IBus Bus not found, maybe the daemon is not running ?");
