[GtkTemplate (ui="/ui/AvroPrefWindow.ui")]
public class AvroPrefWindow : Gtk.ApplicationWindow {
	[GtkChild]
	public Gtk.Switch toggle_preview { get; set; }

	[GtkChild]
	public Gtk.Switch toggle_dict { get; set; }

	[GtkChild]
	public Gtk.Switch toggle_newline { get; set; }

	[GtkChild]
	public Gtk.Scale scale_lutable_size { get; set; }

	[GtkChild]
	public Gtk.Adjustment adjust_lutable_size { get; set; }

	[GtkChild]
	public Gtk.ComboBoxText selection_lutable_orientation { get; set; }

	internal AvroPrefWindow (AvroPrefApplication app) {
		Object (application: app, title: "Avro Phonetic Preferences");

		var settings = new Settings ("com.omicronlab.avro");
		settings.bind("toggle-preview", toggle_preview, "active", GLib.SettingsBindFlags.DEFAULT);
		settings.bind("toggle-dict", toggle_dict, "active", GLib.SettingsBindFlags.DEFAULT);
		settings.bind("toggle-newline", toggle_newline, "active", GLib.SettingsBindFlags.DEFAULT);
		settings.bind("lutable-size", adjust_lutable_size, "value", GLib.SettingsBindFlags.DEFAULT);
		settings.bind("lutable-orientation", selection_lutable_orientation, "active", GLib.SettingsBindFlags.DEFAULT);

		toggle_preview.notify["active"].connect(validate);
		toggle_newline.notify["active"].connect(validate);
		toggle_dict.notify["active"].connect(validate);
		
		validate();
	}

	void validate() {
		var is_preview = toggle_preview.active;

		if (!is_preview) {
			toggle_newline.active = false;
			toggle_dict.active = false;
		}
		toggle_dict.sensitive = is_preview;
		toggle_newline.sensitive = is_preview;
		scale_lutable_size.sensitive = is_preview;
		selection_lutable_orientation.sensitive = is_preview;
	}
}

class AvroPrefApplication : Gtk.Application {
	protected override void activate () {
		var window = new AvroPrefWindow (this);
		window.show_all ();
	}

	internal AvroPrefApplication () {
		Object (application_id: "com.omicronlab.avro.pref");
	}
}

int main (string[] args) {
	return new AvroPrefApplication ().run (args);
}