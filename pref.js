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


    Contributor(s): ______________________________________.

    *****************************************************************************
    =============================================================================
*/

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GLib = imports.gi.GLib;
const eevars = imports.evars;

Gtk.init(null, 0);
let builder = new Gtk.Builder();
builder.add_from_file(eevars.get_pkgdatadir() + "/avropref.ui");

let prefwindow = builder.get_object("window1");
let switch_auxtxt = builder.get_object("switch_auxtxt");
let switch_lutable = builder.get_object("switch_lutable");


let setting = Gio.Settings.new("org.omicronlab.avro")
setting.bind("switch-auxtxt", switch_auxtxt, "active", Gio.SettingsBindFlags.DEFAULT)
setting.bind("switch-lutable", switch_lutable, "active", Gio.SettingsBindFlags.DEFAULT)


prefwindow.connect ("destroy", function(){Gtk.main_quit()});
prefwindow.show_all();

Gtk.main();
