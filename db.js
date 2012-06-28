//#!/usr/bin/env gjs

const GLib = imports.gi.GLib;
const Gda = imports.gi.Gda;

imports.searchPath.unshift('.');
const eevars = imports.evars;

function DB () {}

DB.prototype = {
    
	loadDb: function () {
	    this._init();
	    //TODO: Change path
        this.connection = new Gda.Connection ({provider: Gda.Config.get_provider("SQLite"),
                                               cnc_string:"DB_DIR=" + GLib.get_current_dir() + ";DB_NAME=Database.db3"});
        this.connection.open ();
        //Vowels
        this._loadOneTable('A', this.w_a);
        this._loadOneTable('AA', this.w_aa);
        this._loadOneTable('I', this.w_i);
        this._loadOneTable('II', this.w_ii);
        this._loadOneTable('U', this.w_u);
        this._loadOneTable('UU', this.w_uu);
        this._loadOneTable('RRI', this.w_rri);
        this._loadOneTable('E', this.w_e);
        this._loadOneTable('OI', this.w_oi);
        this._loadOneTable('O', this.w_o);
        this._loadOneTable('OU', this.w_ou);
        //Consonants
        this._loadOneTable('B', this.w_b);
        this._loadOneTable('BH', this.w_bh);
        this._loadOneTable('C', this.w_c);
        this._loadOneTable('CH', this.w_ch);
        this._loadOneTable('D', this.w_d);
        this._loadOneTable('Dd', this.w_dd);
        this._loadOneTable('Dh', this.w_dh);
        this._loadOneTable('Ddh', this.w_ddh);
        this._loadOneTable('G', this.w_g);
        this._loadOneTable('Gh', this.w_gh);
        this._loadOneTable('H', this.w_h);
        this._loadOneTable('J', this.w_j);
        this._loadOneTable('Jh', this.w_jh);
        this._loadOneTable('K', this.w_k);
        this._loadOneTable('Kh', this.w_kh);
        this._loadOneTable('L', this.w_l);
        this._loadOneTable('M', this.w_m);
        this._loadOneTable('N', this.w_n);
        this._loadOneTable('NN', this.w_nn);
        this._loadOneTable('NGA', this.w_nga);
        this._loadOneTable('NYA', this.w_nya);
        this._loadOneTable('P', this.w_p);
        this._loadOneTable('Ph', this.w_ph);
        this._loadOneTable('R', this.w_r);
        this._loadOneTable('Rr', this.w_rr);
        this._loadOneTable('Rrh', this.w_rrh);
        this._loadOneTable('S', this.w_s);
        this._loadOneTable('Sh', this.w_sh);
        this._loadOneTable('Ss', this.w_ss);
        this._loadOneTable('T', this.w_t);
        this._loadOneTable('TT', this.w_tt);
        this._loadOneTable('TH', this.w_th);
        this._loadOneTable('TTH', this.w_tth);
        this._loadOneTable('Y', this.w_y);
        this._loadOneTable('Z', this.w_z);
        this._loadOneTable('Khandatta', this.w_khandatta);
        
        this.connection.close ();
  	},


	unloadDb: function () {
	    this._init();
  	},


	_loadOneTable: function (tableName, wArray) {
	    if (this.connection){
	        if (this.connection.is_opened){
	            // TODO: Need to check. Gda.execute_select_command doesn't seem to work with gir1.2-gda-5* package in Ubuntu,
	            // but gir1.2-gda-4.0 works fine
	            var dm = Gda.execute_select_command (this.connection, "select * from " + tableName);
                var iter = dm.create_iter();

                while (iter.move_next ()) {
                    var w = Gda.value_stringify (iter.get_value_at (0));
                    wArray.push(w);
                }
	        }
	    }
    },
    
    
    _printArray: function(wArray){
        for (w in wArray){
            print(wArray[w]);
        }
    },


	_init: function () {
	    this.w_a = [];
        this.w_aa = [];
        this.w_i = [];
        this.w_ii = [];
        this.w_u = [];
        this.w_uu = [];
        this.w_rri = [];
        this.w_e = [];
        this.w_oi = [];
        this.w_o = [];
        this.w_ou = [];

        this.w_b = [];
        this.w_bh = [];
        this.w_c = [];
        this.w_ch = [];
        this.w_d = [];
        this.w_dh = [];
        this.w_dd = [];
        this.w_ddh = [];
        this.w_g = [];
        this.w_gh = [];
        this.w_h = [];
        this.w_j = [];
        this.w_jh = [];
        this.w_k = [];
        this.w_kh = [];
        this.w_l = [];
        this.w_m = [];
        this.w_n = [];
        this.w_nga = [];
        this.w_nya = [];
        this.w_nn = [];
        this.w_p = [];
        this.w_ph = [];
        this.w_r = [];
        this.w_rr = [];
        this.w_rrh = [];
        this.w_s = [];
        this.w_sh = [];
        this.w_ss = [];
        this.w_t = [];
        this.w_th = [];
        this.w_tt = [];
        this.w_tth = [];
        this.w_y = [];
        this.w_z = [];
        this.w_khandatta = [];
  	}
}


/* --------- */
/* Test code */
/* --------- */
//var __db = new DB ();
//__db.loadDb();
//__db._printArray(db.w_khandatta);