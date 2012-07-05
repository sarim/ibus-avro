const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GLib = imports.gi.GLib;

Gtk.init(null, 0);
let builder = new Gtk.Builder();
builder.add_from_file("/home/sarim/avropref.ui");

let prefwindow = builder.get_object("window1");
let switch_auxtxt = builder.get_object("switch_auxtxt");
let switch_lutable = builder.get_object("switch_lutable");


let setting = Gio.Settings.new("org.freedesktop.avro")
setting.bind("switch-auxtxt", switch_auxtxt, "active", Gio.SettingsBindFlags.DEFAULT)
setting.bind("switch-lutable", switch_lutable, "active", Gio.SettingsBindFlags.DEFAULT)


prefwindow.connect ("destroy", function(){Gtk.main_quit()});
prefwindow.show_all();

Gtk.main();
