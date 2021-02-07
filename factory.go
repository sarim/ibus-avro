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
	pref := avrophonetic.Preference{}

	avroParser := avroclassic.Parser{Data: db.Classicdb}
	regexParser := avroregex.Parser{Data: db.Regexdb}
	dBSearch := avrodict.Searcher{Table: db.Dictdb, Regex: &regexParser}

	//TODO: implement a persistent CandidateSelector
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

	avroUtil := &AvroUtil{}

	engine := &AvroEngine{ibus.BaseEngine(conn, objectPath), ibus.NewPropList(propp), avroUtil}

	avroUtil.Engine = engine
	avroUtil.SuggestionBuilder = sb
	avroUtil.InitSetting()
	avroUtil.ResetAll()

	ibus.PublishEngine(conn, objectPath, engine)
	return objectPath
}
