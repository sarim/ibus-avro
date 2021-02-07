package main

import (
	"fmt"

	"github.com/godbus/dbus"
	"github.com/sarim/avro-go/avroclassic"
	"github.com/sarim/avro-go/avrodata"
	"github.com/sarim/avro-go/avrodict"
	"github.com/sarim/avro-go/avrophonetic"
	"github.com/sarim/avro-go/avroregex"
	"github.com/sarim/goibus/ibus"
)

var eid = 0
var sb *avrophonetic.SuggestionBuilder

func InitAvroPhonetic() {
	db := avrodata.NewDB()
	pref := avrophonetic.Preference{false}

	avroParser := avroclassic.Parser{db.Classicdb}
	regexParser := avroregex.Parser{db.Regexdb}
	dBSearch := avrodict.Searcher{db.Dictdb, &regexParser}

	//TODO: implement a persistant CandidateSelector
	candSelector := avrophonetic.NewInMemoryCandidateSelector(nil)

	sb = avrophonetic.NewBuilder(&dBSearch, db.Autocorrect, &avroParser, db.Suffixdb, pref, candSelector)

}

func AvroEngineCreator(conn *dbus.Conn, engineName string) dbus.ObjectPath {
	eid++
	fmt.Println("Creating Avro Engine #", eid)
	objectPath := dbus.ObjectPath(fmt.Sprintf("/org/freedesktop/IBus/Engine/AvroGo/%d", eid))

	propp := ibus.NewProperty(
		"setup",
		ibus.PROP_TYPE_NORMAL,
		"Preferences - Avro",
		"gtk-preferences",
		"Configure Avro",
		true,
		true,
		ibus.PROP_STATE_UNCHECKED)

	avroutil := &AvroUtil{}

	engine := &AvroEngine{ibus.BaseEngine(conn, objectPath), ibus.NewPropList(propp), avroutil}

	avroutil.Engine = engine
	avroutil.SuggestionBuilder = sb
	avroutil.InitSetting()
	avroutil.ResetAll()

	ibus.PublishEngine(conn, objectPath, engine)
	return objectPath
}
