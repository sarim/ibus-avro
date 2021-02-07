class AvroPrefWindow : Gtk.ApplicationWindow {

	internal AvroPrefWindow (AvroPrefApplication app) {
		Object (application: app, title: "Avro Phonetic Preferences");

		this.set_default_size (300, 100);
		this.border_width = 10;

		var label = new Gtk.Label ("Preview Window");
		var switcher = new Gtk.Switch ();

		switcher.set_active (true);

		switcher.notify["active"].connect (switcher_cb);

		var grid = new Gtk.Grid ();
		grid.set_column_spacing (10);
		grid.attach (label, 0, 0, 1, 1);
		grid.attach (switcher, 1, 0, 1, 1);

		this.add (grid);
	}

	void switcher_cb (Object switcher, ParamSpec pspec) {
		if ((switcher as Gtk.Switch).get_active())
			print ("\rSwitch On ");
		else
			print ("\rSwitch Off");
	}
}

class AvroPrefApplication : Gtk.Application {
	protected override void activate () {

		var window = new AvroPrefWindow (this);
		window.show_all (); //show all the things
	}

	internal AvroPrefApplication () {
		Object (application_id: "com.omicronlab.avro.pref");
	}
}

int main (string[] args) {
	return new AvroPrefApplication ().run (args);
}