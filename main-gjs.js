#!/usr/bin/env gjs
const IBus = imports.gi.IBus;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Avroparser = imports.avrolib.OmicronLab.Avro.Phonetic;
const utfconv = imports.utf8;
//Seed.include('avro-lib.js');

IBus.init();
//get the ibus bus
var bus = new IBus.Bus();


if(bus.is_connected()){
	
    var id = 0;
    
    function _create_engine_cb(factory, engine_name){
		
	id += 1;
   var engine =  new IBus.Engine({ engine_name: engine_name,
                                   object_path: '/org/freedesktop/IBus/Engine/' + id,
                                   connection: bus.get_connection()});
	    
   engine.connect('process-key-event',
      function(engine,keyval,keycode,state){
				
		//print(keyval + " " +  keycode);
		   // ignore release event
		if (!(state == 0 || state == 1))
			return false;
			// capture the shift key
		if (keycode == 42) return true;
		
           // process letter key events
		if (keyval >= 33 && keyval <= 126){
			
				engine.buffertext += IBus.keyval_to_unicode(keyval);
				let bntext = Avroparser.parse(engine.buffertext);
				bntext = utfconv.utf8Decode(bntext);
				let text = IBus.Text.new_from_string(bntext);
				engine.update_preedit_text(text,bntext.length,true);
        
				return true;				
			}
			
		else if (keyval == IBus.Return || keyval == IBus.space) {
		
				let bntext = Avroparser.parse(engine.buffertext);
				bntext = utfconv.utf8Decode(bntext);
				let text = IBus.Text.new_from_string(bntext);
				engine.commit_text(text);
				engine.buffertext = "";
				engine.hide_preedit_text();
			
			if (keyval == IBus.space) {
				
				engine.commit_text( IBus.Text.new_from_string(" "));
				return true;
				
			}
			else {
				//engine.forward_key_event(engine,115,31,state);
				engine.commit_text( IBus.Text.new_from_string("\n"));
				
				return true;
			}
		}
		
		else if (keyval == IBus.BackSpace){
			if (engine.buffertext.length > 0) {
				engine.buffertext = engine.buffertext.substr(0,engine.buffertext.length -1);
				let bntext = Avroparser.parse(engine.buffertext);
				bntext = utfconv.utf8Decode(bntext);
				let text = IBus.Text.new_from_string(bntext);
				engine.update_preedit_text(text,bntext.length,true);
        
				return true;				
				}
			
			}
		else if (keyval == IBus.Left || keyval == IBus.Right || keyval == IBus.Up || keyval == IBus.Down || keyval == IBus.Control_L || keyval == IBus.Control_R || keyval == IBus.Insert   || keyval == IBus.Delete || keyval == IBus.Home || keyval == IBus.Page_Up || keyval == IBus.Page_Down || keyval == IBus.End || keyval == IBus.Alt_L || keyval == IBus.Alt_R ){
				let bntext = Avroparser.parse(engine.buffertext);
				bntext = utfconv.utf8Decode(bntext);
				let text = IBus.Text.new_from_string(bntext);
				engine.commit_text(text);
				engine.buffertext = "";
				engine.hide_preedit_text();
			
			}
		return false ;
   });
   
	engine.buffertext = "";	
    return engine; 
}


   
    var factory =  IBus.Factory.new(  bus.get_connection() );
   
       
   //factory.add_engine("avro-phonetic",GObject.type_from_name('IBusEngine'));
   factory.connect('create-engine', _create_engine_cb);
    var	component = new IBus.Component({
        name:"org.freedesktop.IBus.Avro",
        description:"Avro phonetic Component",
        version:"0.1.0",
        license:"GPL",
        author:"Sarim Khan <sarim2005@gmail.com>",
        homepage:"http://omicronlab.com",
        exec:"/home/sarim/ibus-avro/main-gjs.js",
        textdomain:"avro-phonetic"
        });
        
    var avroenginedesc = new IBus.EngineDesc({
        name:"avro-phonetic",
        longname:"avro phonetic",
        description:"Avro Phonetic Engine",
        language:"bn",
        license:"GPL",
        author:"Sarim Khan <sarim2005@gmail.com>",
        icon:"/home/sarim/ibus-avro/avro-bangla.png",
        layout:"us"
        });
        
    component.add_engine (avroenginedesc);
    
    bus.register_component (component);
    IBus.main();    
    
    }
