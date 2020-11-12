#!/usr/bin/env gjs

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


    Contributor(s): Mehdi Hasan Khan <mhasan@omicronlab.com>

    *****************************************************************************
    =============================================================================
*/


const IBus = imports.gi.IBus;
imports.searchPath.unshift('.');
const eevars = imports.evars;
const suggestion = imports.suggestionbuilder;
const Gio = imports.gi.Gio;
const prefwindow = imports.pref;

//check if running from ibus
var exec_by_ibus = (ARGV[0] == '--ibus')

// Let's initialize ibus
IBus.init();

//get the ibus bus
var bus = new IBus.Bus();

if (bus.is_connected()) {
    
    /* =========================================================================== */
    /* =========================================================================== */
    /*                           IBus Engine                                       */
    /* =========================================================================== */
    /* =========================================================================== */
    
    var id = 0;

    function _create_engine_cb(factory, engine_name) {

        id += 1;
        var engine = new IBus.Engine({
            engine_name: engine_name,
            object_path: '/org/freedesktop/IBus/Engine/' + id,
            connection: bus.get_connection()
        });
        print("Created Engine #" + id);

        engine.connect('process-key-event', engine_process_key_event );

        engine.connect('candidate-clicked', engine_candidate_clicked );
        
        engine.connect('focus-out', engine_focus_out );

        engine.connect('focus-in', engine_focus_in );

        engine.connect('property-activate', engine_property_activate );

        engine.lookuptable = IBus.LookupTable.new(16, 0, true, true);        
        resetAll(engine);
        initSetting(engine);
        return engine;
    }
    
    function engine_process_key_event(engine, keyval, keycode, state) {

        //print keypress infos, helpful for debugging
        print(keyval + " " + keycode + " " + state);

        //sanitize state, main reason is to weed out xorg masks
        state = state & IBus.ModifierType.MODIFIER_MASK;

        //ignore release event
        if (!(state == 0 || state == 1 || state == 16 || state == 17)) {
            return false;
        }

        // capture the shift key
        if (keycode == 42) {
            return true;
        }

        // process letter key events
        if ((keyval >= 33 && keyval <= 126) ||
            (keyval >= IBus.KP_0 && keyval <= IBus.KP_9) ||
             keyval == IBus.KP_Add ||
             keyval == IBus.KP_Decimal ||
             keyval == IBus.KP_Divide ||
             keyval == IBus.KP_Multiply ||
             keyval == IBus.KP_Divide ||
             keyval == IBus.KP_Subtract) {
            
            engine.buffertext += IBus.keyval_to_unicode(keyval);
            updateCurrentSuggestions(engine);
            return true;
            
        } else if (keyval == IBus.Return || keyval == IBus.space || keyval == IBus.Tab) {
            if (engine.buffertext.length > 0){
                if ((keyval == IBus.Return) && engine.setting_switch_newline && engine.setting_switch_preview && (engine.buffertext.length > 0)){
                    commitCandidate(engine);
                    return true;
                } else {
                    commitCandidate(engine);
                }
            }

        } else if (keyval == IBus.BackSpace) {
            if (engine.buffertext.length > 0) {
                engine.buffertext = engine.buffertext.substr(0, engine.buffertext.length - 1);
                updateCurrentSuggestions(engine);
                
                if (engine.buffertext.length <= 0) {
                    resetAll(engine);                  
                }
                return true;
            } 
        } else if (keyval == IBus.Left || keyval == IBus.KP_Left || keyval == IBus.Right || keyval == IBus.KP_Right) {
            if (engine.currentSuggestions.length <= 0 || engine.lookuptable.get_orientation() == 1){                    
                commitCandidate(engine);
            } else {
                if (keyval == IBus.Left || keyval == IBus.KP_Left) {
                    decSelection(engine);
                }
                else if (keyval == IBus.Right || keyval == IBus.KP_Right) {
                    incSelection(engine);
                }
                
                return true;
            }
            
        } else if (keyval == IBus.Up || keyval == IBus.KP_Up || keyval == IBus.Down || keyval == IBus.KP_Down) {
            print (engine.lookuptable.get_orientation());
            if (engine.currentSuggestions.length <= 0 || engine.lookuptable.get_orientation() == 0){                    
                commitCandidate(engine);
            } else {
                if (keyval == IBus.Up) {
                    decSelection(engine);
                }
                else if (keyval == IBus.Down) {
                    incSelection(engine);
                }
                
                return true;
            }
       
        } else if (keyval == IBus.Control_L || 
                   keyval == IBus.Control_R || 
                   keyval == IBus.Insert || 
                   keyval == IBus.KP_Insert || 
                   keyval == IBus.Delete || 
                   keyval == IBus.KP_Delete || 
                   keyval == IBus.Home || 
                   keyval == IBus.KP_Home || 
                   keyval == IBus.Page_Up || 
                   keyval == IBus.KP_Page_Up || 
                   keyval == IBus.Page_Down || 
                   keyval == IBus.KP_Page_Down || 
                   keyval == IBus.End || 
                   keyval == IBus.KP_End || 
                   keyval == IBus.Alt_L || 
                   keyval == IBus.Alt_R || 
                   keyval == IBus.Super_L || 
                   keyval == IBus.Super_R || 
                   keyval == IBus.Return || 
                   keyval == IBus.space || 
                   keyval == IBus.Tab || 
                   keyval == IBus.KP_Enter) {
                
                commitCandidate(engine);
        }
        return false;
    }

    function engine_candidate_clicked(engine,index,button,state) {
        if (engine.buffertext.length > 0) {
            engine.currentSelection = index;
            preeditCandidate(engine);
            suggestionBuilder.updateCandidateSelection(engine.buffertext, engine.currentSuggestions[engine.currentSelection]);
            print("candidate clicked: " + index + " " + button + " " + state);
        }
    }

    function engine_focus_out(engine) {
        if (engine.buffertext.length > 0) {
            commitCandidate(engine);
        }
    }

    var proplist = new IBus.PropList();
    var propp = IBus.Property.new(
        'setup',
        IBus.PropType.NORMAL,
        IBus.Text.new_from_string("Preferences - Avro"),
        'gtk-preferences',
        IBus.Text.new_from_string("Configure Avro"),
        true,
        true,
        IBus.PropState.UNCHECKED,
        null
    );

    proplist.append(propp);

    function engine_focus_in(engine) {    
        engine.register_properties(proplist);
    }

    function engine_property_activate(engine) {    
        runPreferences();
    }

    /* =========================================================================== */
    /* =========================================================================== */
    /*                  Engine Utility Functions                                   */
    /* =========================================================================== */
    /* =========================================================================== */
    
    var suggestionBuilder = new suggestion.SuggestionBuilder();
    
    function initSetting(engine){
        engine.setting = Gio.Settings.new("com.omicronlab.avro");
    
        //set up a asynchronous callback for instant change later
        engine.setting.connect('changed', 
            function(){
                readSetting(engine);
        });
    
        //read manually first time
        readSetting(engine);
    }
    
    
    function readSetting(engine){
        engine.setting_switch_preview = engine.setting.get_boolean('switch-preview');
        engine.setting_switch_dict = engine.setting.get_boolean('switch-dict');
        engine.setting_switch_newline = engine.setting.get_boolean('switch-newline');
        engine.lookuptable.set_orientation(engine.setting.get_int('cboxorient'));
        engine.setting_lutable_size = engine.setting.get_int('lutable-size');
        engine.lookuptable.set_page_size(engine.setting_lutable_size);
        
        if (!engine.setting_switch_preview){
            engine.setting_switch_dict = false;
            engine.setting_switch_newline = false;
        }
        
        var dictPref =  suggestionBuilder.getPref();
        dictPref.dictEnable = engine.setting_switch_dict;
        suggestionBuilder.setPref(dictPref);
    }
    
    
    function resetAll(engine){
        engine.currentSuggestions = [];
        engine.currentSelection = 0;
        
        engine.buffertext = "";
        engine.lookuptable.clear();
        engine.hide_preedit_text();
        engine.hide_auxiliary_text();
        engine.hide_lookup_table();
    }
    
    
    function updateCurrentSuggestions(engine){
        var suggestion = suggestionBuilder.suggest(engine.buffertext);
        engine.currentSuggestions = suggestion['words'].slice(0, engine.setting_lutable_size);
        engine.currentSelection = suggestion['prevSelection'];
        
        fillLookupTable (engine);
    }
    
    
    function fillLookupTable (engine){
        
        if (engine.setting_switch_preview){
            var auxiliaryText = IBus.Text.new_from_string(engine.buffertext);
            engine.update_auxiliary_text(auxiliaryText, true);
            
            if (engine.setting_switch_dict){
                engine.lookuptable.clear();

                engine.currentSuggestions.forEach(function(word){
                    let wtext = IBus.Text.new_from_string(word);
                    //default, ibus sets "1,2,3,4...." as label, i didn't find how to hide it,but a empty string can partially hide it
                    let wlabel = IBus.Text.new_from_string('');;
                    engine.lookuptable.append_candidate(wtext);
                    engine.lookuptable.append_label(wlabel);
                });   
            }
        }
        
        preeditCandidate(engine);
    }
    
    
    function preeditCandidate(engine){
        if (engine.setting_switch_preview){
            if (engine.setting_switch_dict){
                engine.lookuptable.set_cursor_pos(engine.currentSelection);
                engine.update_lookup_table_fast(engine.lookuptable,true);
            }
        }
        
        var preeditText = IBus.Text.new_from_string(engine.currentSuggestions[engine.currentSelection]);
        engine.update_preedit_text(preeditText, engine.currentSuggestions[engine.currentSelection].length, true);
    }
    
    function commitCandidate(engine){
        if (engine.buffertext.length > 0){
            var commitText = IBus.Text.new_from_string(engine.currentSuggestions[engine.currentSelection]);
            engine.commit_text(commitText);
        }
        
        suggestionBuilder.stringCommitted(engine.buffertext, engine.currentSuggestions[engine.currentSelection]);
        
        resetAll(engine);
    }
    
    function incSelection(engine){
        var lastIndex = engine.currentSuggestions.length - 1;
        
        if ((engine.currentSelection + 1) > lastIndex){
            engine.currentSelection = -1;
        } 
        ++engine.currentSelection;
        preeditCandidate(engine);
        
        suggestionBuilder.updateCandidateSelection(engine.buffertext, engine.currentSuggestions[engine.currentSelection]);
    }
    
    function decSelection(engine){
        if ((engine.currentSelection - 1) < 0){
            engine.currentSelection = engine.currentSuggestions.length;
        }
        --engine.currentSelection;
        preeditCandidate(engine);
        
        suggestionBuilder.updateCandidateSelection(engine.buffertext, engine.currentSuggestions[engine.currentSelection]);
    }
    
    function runPreferences(){
        //code for running preferences windows will be here
        prefwindow.runpref();
    }
    /* =========================================================================== */
    /* =========================================================================== */
    /*                           IBus Factory                                      */
    /* =========================================================================== */
    /* =========================================================================== */

    var factory = IBus.Factory.new(bus.get_connection());
    factory.connect('create-engine', _create_engine_cb);

    // property 'exec' is changed to 'command-line' in recent ibus,the try-catch block is here for supporting both.
    var component = null;   
    try {      
        component = new IBus.Component({
            name: "org.freedesktop.IBus.Avro",
            description: "Avro Phonetic",
            version: "1.1",
            license: "MPL 1.1",
            author: "Sarim Khan <sarim2005@gmail.com>",
            homepage: "https://github.com/sarim/ibus-avro",
            command_line: eevars.get_libexecdir() + "/main-gjs.js",
            textdomain: "avro-phonetic"
        });
    } catch (error) {
        component = new IBus.Component({
            name: "org.freedesktop.IBus.Avro",
            description: "Avro Phonetic",
            version: "1.1",
            license: "MPL 1.1",
            author: "Sarim Khan <sarim2005@gmail.com>",
            homepage: "https://github.com/sarim/ibus-avro",
            exec: eevars.get_libexecdir() + "/main-gjs.js",
            textdomain: "avro-phonetic"
        });
    }
    
    //opensuse's ibus supports only Property(Menu) but ubuntu only supports "setup" param for Preferences Button, try-catch in rescue
    try {
        var avroenginedesc = new IBus.EngineDesc({
            name: "avro-phonetic",
            longname: "Avro Phonetic",
            description: "Avro Phonetic Engine",
            language: "bn",
            license: "MPL 1.1",
            author: "Sarim Khan <sarim2005@gmail.com>",
            icon: eevars.get_pkgdatadir() + "/avro-bangla.png",
            layout: "bn",
            setup: "/usr/bin/env gjs --include-path=" + eevars.get_pkgdatadir() + " " + eevars.get_pkgdatadir() + "/pref.js --standalone"
        });
    } catch (error) {
        var avroenginedesc = new IBus.EngineDesc({
            name: "avro-phonetic",
            longname: "Avro Phonetic",
            description: "Avro Phonetic Engine",
            language: "bn",
            license: "MPL 1.1",
            author: "Sarim Khan <sarim2005@gmail.com>",
            icon: eevars.get_pkgdatadir() + "/avro-bangla.png",
            layout: "bn"
        });
    
    }

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
