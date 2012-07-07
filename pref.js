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
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GLib = imports.gi.GLib;
const eevars = imports.evars;

var prefwindow, switch_preview, switch_newline, switch_dict, lutable_size, cboxorient, scale1;

function runpref() {

    Gtk.init(null, 0);
    let builder = new Gtk.Builder();
    builder.add_from_file(eevars.get_pkgdatadir() + "/avropref.ui");

    prefwindow = builder.get_object("window1");
    switch_preview = builder.get_object("switch_preview");
    switch_newline = builder.get_object("switch_newline");
    switch_dict = builder.get_object("switch_dict");
    lutable_size = builder.get_object("lutable_size"); 
    scale1 = builder.get_object("scale1"); 
    cboxorient = builder.get_object("cboxorient");
    
    switch_preview.connect("notify::active", validate);
    switch_newline.connect("notify::active", validate);
    switch_dict.connect("notify::active", validate);


    let setting = Gio.Settings.new("com.omicronlab.avro")
    setting.bind("switch-preview", switch_preview, "active", Gio.SettingsBindFlags.DEFAULT)
    setting.bind("switch-dict", switch_dict, "active", Gio.SettingsBindFlags.DEFAULT)
    setting.bind("switch-newline", switch_newline, "active", Gio.SettingsBindFlags.DEFAULT)
    setting.bind("lutable-size", lutable_size, "value", Gio.SettingsBindFlags.DEFAULT)
    setting.bind("cboxorient", cboxorient, "active", Gio.SettingsBindFlags.DEFAULT)

    validate();

    prefwindow.connect ("destroy", function(){Gtk.main_quit()});
    prefwindow.show_all();

    Gtk.main();
}

function validate(){
    if (!switch_preview.get_active()){
        switch_newline.set_active(false);
        switch_dict.set_active(false);

        switch_dict.sensitive = false;
        switch_newline.sensitive = false;
        scale1.sensitive = false;
        cboxorient.sensitive = false;
    } else {
        switch_dict.sensitive = true;
        switch_newline.sensitive = true;
        scale1.sensitive = true;
        cboxorient.sensitive = true;
    }
}

//check if running standalone
if(ARGV[0] == '--standalone'){
    //running standalone, so no one to call me,calling myself
    runpref();
}
