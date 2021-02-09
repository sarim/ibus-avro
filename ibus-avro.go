package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"

	"github.com/godbus/dbus"
	"github.com/sarim/goibus/ibus"
)

var embedded = flag.Bool("ibus", false, "Run the embedded ibus component")
var standalone = flag.Bool("standalone", false, "Run standalone by creating new component")
var generateXML = flag.String("xml", "", "Write xml representation of component to file or stdout if file == \"-\"")
var prefix = flag.String("prefix", "/usr", "The directory where the software is installed")

//TODO: get project name from build system via ldflags
const engineBinary = "ibus-engine-avro-beta"
const setupBinary = "ibus-setup-avro-beta"

func makeComponent() *ibus.Component {

	component := ibus.NewComponent(
		"org.freedesktop.IBus.AvroBeta",
		"Avro Phonetic Beta",
		"2.0",
		"MPL 1.1",
		"Sarim Khan <sarim2005@gmail.com>",
		"https://github.com/sarim/ibus-avro",
		filepath.Join(*prefix, "lib", "ibus", engineBinary)+" -ibus",
		"avro-phonetic-beta")

	avroenginedesc := ibus.SmallEngineDesc(
		"ibus-avro-beta",
		"Avro Phonetic Beta",
		"Avro Phonetic Beta Engine",
		"bn",
		"MPL 1.1",
		"Sarim Khan <sarim2005@gmail.com>",
		filepath.Join(*prefix, "share", "ibus-avro-beta", "avro-bangla.png"),
		"us",
		filepath.Join(*prefix, "lib", "ibus", setupBinary),
		"2.0")

	component.AddEngine(avroenginedesc)

	return component
}

func main() {

	var Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage of %s:\n", os.Args[0])
		flag.CommandLine.VisitAll(func(f *flag.Flag) {
			format := "  -%s: %s\n"
			fmt.Fprintf(os.Stderr, format, f.Name, f.Usage)
		})
	}

	flag.Parse()

	if *generateXML != "" {
		c := makeComponent()

		if *generateXML == "-" {
			c.OutputXML(os.Stdout)
		} else {
			f, err := os.Create(*generateXML)
			if err != nil {
				panic(err)
			}

			c.OutputXML(f)
			f.Close()
		}
	} else if *embedded {
		bus := ibus.NewBus()
		fmt.Println("Got Bus, Running Embeded")

		InitAvroPhonetic()

		conn := bus.GetDbusConn()
		ibus.NewFactory(conn, AvroEngineCreator)
		bus.RequestName("org.freedesktop.IBus.AvroBeta", 0)
		select {}
	} else if *standalone {
		bus := ibus.NewBus()
		fmt.Println("Got Bus, Running Standalone")

		InitAvroPhonetic()

		conn := bus.GetDbusConn()
		ibus.NewFactory(conn, AvroEngineCreator)
		bus.RegisterComponent(makeComponent())

		fmt.Println("Setting Global Engine to me")
		bus.CallMethod("SetGlobalEngine", 0, "ibus-avro-beta")

		c := make(chan *dbus.Signal, 10)
		conn.Signal(c)

		select {
		case <-c:
		}

	} else {
		Usage()
		os.Exit(1)
	}
}
