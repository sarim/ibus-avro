#!/usr/bin/env seed
const IBus = imports.gi.IBus;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;

Seed.include('avro-lib.js');

IBus.init();
//get the ibus bus
var bus = new IBus.Bus();


if(bus.is_connected()){
    
    
    var avroengine = new GType({
        name:"avroengine",
        parent:GObject.type_from_name('IBusEngine'),
        
        init: function(klass){
            //print("i am geting warmed up");
            
            //for (i in this.signal) print (i);
           // this.signal.enable.connect(function() {
           //     print("enabled");
           //     });
            
            klass.signal.connect(
            "process-key-event",
            function(engine,keyval,keycode,state){
                //for (i in engine) print (i);
				
                return true;
                });
            
            }
        });
    
    
    var factory = new IBus.Factory.c_new(  bus.get_connection() );
   
       
    //factory.add_engine("avro-phonetic",GObject.type_from_name('avroengine'));
    factory.signal.connect('create-engine', function(f,engine_name){  
		var engine =  new IBus.Engine({ engine_name: engine_name,
                                   object_path: '/org/freedesktop/IBus/Engine/1',
                                   connection: bus.get_connection()});
        engine.signal.connect("process-key-event",
            function(engine,keyval,keycode,state){
                //for (i in engine) print (i);
				pri;
                return true;
                });
        
		return engine;
		});
    
    var	component = new IBus.Component({
        name:"org.freedesktop.IBus.Avro",
        description:"Avro phonetic Component",
        version:"0.1.0",
        license:"GPL",
        author:"Sarim Khan <sarim2005@gmail.com>",
        homepage:"http://omicronlab.com",
        exec:"/home/sarim/avro/main.js",
        textdomain:"avro-phonetic"
        });
        
    var avroenginedesc = new IBus.EngineDesc({
        name:"avro-phonetic",
        longname:"avro phonetic",
        description:"Avro Phonetic Engine",
        language:"bn",
        license:"GPL",
        author:"Sarim Khan <sarim2005@gmail.com>",
        icon:"/home/sarim/avro-bangla.png",
        layout:"us"
        });
        
    component.add_engine (avroenginedesc);
    
    bus.register_component (component);
    IBus.main();    
    
    }

