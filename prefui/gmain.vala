[GtkTemplate (ui="/ui/AvroPrefWindow.ui")]
public class AvroPrefWindow : Gtk.ApplicationWindow {
	[GtkChild]
	public Gtk.Switch switch_preview { get; set; }
}

int main (string[] args) {
	Gtk.init (ref args);
	var window = new AvroPrefWindow ();
	window.show_all ();
	window.destroy.connect(() => Gtk.main_quit());
	Gtk.main ();
	return 0;
}