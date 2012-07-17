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

    The Original Code is jsAvroPhonetic

    The Initial Developer of the Original Code is
    Mehdi Hasan Khan <mhasan@omicronlab.com>

    Copyright (C) OmicronLab (http://www.omicronlab.com). All Rights Reserved.


    Contributor(s): ______________________________________.

    *****************************************************************************
    =============================================================================
*/

const gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gda = imports.gi.Gda;

function DB () {}

var database = {};
var suffixDict = {};

DB.prototype = {
    
	loadDb: function () {
	    this._init();
	    //TODO: Change path
        this.connection = new Gda.Connection ({provider: Gda.Config.get_provider("SQLite"),
                                               cnc_string:"DB_DIR=" + GLib.get_current_dir() + ";DB_NAME=Database.db3"});
        this.connection.open ();
        //Vowels
        this._loadOneTable('A', database.w_a);
        this._loadOneTable('AA', database.w_aa);
        this._loadOneTable('I', database.w_i);
        this._loadOneTable('II', database.w_ii);
        this._loadOneTable('U', database.w_u);
        this._loadOneTable('UU', database.w_uu);
        this._loadOneTable('RRI', database.w_rri);
        this._loadOneTable('E', database.w_e);
        this._loadOneTable('OI', database.w_oi);
        this._loadOneTable('O', database.w_o);
        this._loadOneTable('OU', database.w_ou);
        //Consonants
        this._loadOneTable('B', database.w_b);
        this._loadOneTable('BH', database.w_bh);
        this._loadOneTable('C', database.w_c);
        this._loadOneTable('CH', database.w_ch);
        this._loadOneTable('D', database.w_d);
        this._loadOneTable('Dd', database.w_dd);
        this._loadOneTable('Dh', database.w_dh);
        this._loadOneTable('Ddh', database.w_ddh);
        this._loadOneTable('G', database.w_g);
        this._loadOneTable('Gh', database.w_gh);
        this._loadOneTable('H', database.w_h);
        this._loadOneTable('J', database.w_j);
        this._loadOneTable('Jh', database.w_jh);
        this._loadOneTable('K', database.w_k);
        this._loadOneTable('Kh', database.w_kh);
        this._loadOneTable('L', database.w_l);
        this._loadOneTable('M', database.w_m);
        this._loadOneTable('N', database.w_n);
        this._loadOneTable('NN', database.w_nn);
        this._loadOneTable('NGA', database.w_nga);
        this._loadOneTable('NYA', database.w_nya);
        this._loadOneTable('P', database.w_p);
        this._loadOneTable('Ph', database.w_ph);
        this._loadOneTable('R', database.w_r);
        this._loadOneTable('Rr', database.w_rr);
        this._loadOneTable('Rrh', database.w_rrh);
        this._loadOneTable('S', database.w_s);
        this._loadOneTable('Sh', database.w_sh);
        this._loadOneTable('Ss', database.w_ss);
        this._loadOneTable('T', database.w_t);
        this._loadOneTable('TT', database.w_tt);
        this._loadOneTable('TH', database.w_th);
        this._loadOneTable('TTH', database.w_tth);
        this._loadOneTable('Y', database.w_y);
        this._loadOneTable('Z', database.w_z);
        this._loadOneTable('Khandatta', database.w_khandatta);
        
        this._loadSuffix();
        
        this.connection.close ();
  	},


	unloadDb: function () {
	    this._init();
  	},

    
    _loadSuffix: function(){
        if (this.connection){
	        if (this.connection.is_opened){
	            var dm = this.connection.execute_select_command ("select * from Suffix");
                var iter = dm.create_iter();

                while (iter.move_next ()) {
                    suffixDict[Gda.value_stringify (iter.get_value_at (0))] = Gda.value_stringify (iter.get_value_at (1));
                }
	        }
	    }
    },

	_loadOneTable: function (tableName, wArray) {
	    if (this.connection){
	        if (this.connection.is_opened){
	            var dm = this.connection.execute_select_command ("select * from " + tableName);
                var iter = dm.create_iter();

                while (iter.move_next ()) {
                    var w = Gda.value_stringify (iter.get_value_at (0));
                    wArray.push(w);
                }
	        }
	    }
    },


	_init: function () {
	    
	    database = {};
        suffixDict = {};
	    
	    database.w_a = [];
        database.w_aa = [];
        database.w_i = [];
        database.w_ii = [];
        database.w_u = [];
        database.w_uu = [];
        database.w_rri = [];
        database.w_e = [];
        database.w_oi = [];
        database.w_o = [];
        database.w_ou = [];

        database.w_b = [];
        database.w_bh = [];
        database.w_c = [];
        database.w_ch = [];
        database.w_d = [];
        database.w_dh = [];
        database.w_dd = [];
        database.w_ddh = [];
        database.w_g = [];
        database.w_gh = [];
        database.w_h = [];
        database.w_j = [];
        database.w_jh = [];
        database.w_k = [];
        database.w_kh = [];
        database.w_l = [];
        database.w_m = [];
        database.w_n = [];
        database.w_nga = [];
        database.w_nya = [];
        database.w_nn = [];
        database.w_p = [];
        database.w_ph = [];
        database.w_r = [];
        database.w_rr = [];
        database.w_rrh = [];
        database.w_s = [];
        database.w_sh = [];
        database.w_ss = [];
        database.w_t = [];
        database.w_th = [];
        database.w_tt = [];
        database.w_tth = [];
        database.w_y = [];
        database.w_z = [];
        database.w_khandatta = [];
  	}
}

function _convertToUnicodeValue(input){
    var output = '';
    
    for (var i = 0; i < input.length; i++){
        var charCode = input.charCodeAt(i);
        if (charCode >= 255){
            output += '\\u0' + charCode.toString(16);
        } else {
            output += input.charAt(i);
        }
    }
    return output;
}


function saveSuffix () {
    try {
        var file = gio.File.new_for_path ("suffixdict.js");

        if (file.query_exists (null)) {
            file.delete (null);
        }
        
        // Create a new file with this name
        var file_stream = file.create (gio.FileCreateFlags.NONE, null);
        
        var json = JSON.stringify(suffixDict);
        json = "var db = " + _convertToUnicodeValue(json) + ";";
        
        // Write text data to file
        var data_stream =  gio.DataOutputStream.new (file_stream);
        data_stream.put_string (json, null);

    } catch (e) {
        print ("Error: " +  e.message);
    }
}


function saveData () {
    try {
        var file = gio.File.new_for_path ("avrodict.js");

        if (file.query_exists (null)) {
            file.delete (null);
        }
        
        // Create a new file with this name
        var file_stream = file.create (gio.FileCreateFlags.NONE, null);
        
        var json = JSON.stringify(database);
        json = "var tables = " + _convertToUnicodeValue(json) + ";";
        
        // Write text data to file
        var data_stream =  gio.DataOutputStream.new (file_stream);
        data_stream.put_string (json, null);

    } catch (e) {
        print ("Error: " +  e.message);
    }
}

var __db = new DB ();
__db.loadDb();
saveData();
saveSuffix();