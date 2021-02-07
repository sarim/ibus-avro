[GtkTemplate (ui="/ui/AvroPrefWindow.ui")]
public class AvroPrefWindow : Gtk.ApplicationWindow {
	[GtkChild]

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