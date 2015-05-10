package main

import (
	"fmt"
	"github.com/godbus/dbus"
	"github.com/sarim/goibus/ibus"
)

type AvroEngine struct {
	ibus.Engine
	propList *ibus.PropList
}

func (e *AvroEngine) ProcessKeyEvent(keyval uint32, keycode uint32, state uint32) (bool, *dbus.Error) {
	fmt.Println("Process Key Event > ", keyval, keycode, state)

	if state == 0 && keyval == 115 {
		e.UpdateAuxiliaryText(ibus.NewText("s"), true)

		lt := ibus.NewLookupTable()
		lt.AppendCandidate("sss")
		lt.AppendCandidate("s")
		lt.AppendCandidate("gittu")
		lt.AppendLabel("1:")
		lt.AppendLabel("2:")
		lt.AppendLabel("3:")

		e.UpdateLookupTable(lt, true)

		e.UpdatePreeditText(ibus.NewText("s"), uint32(1), true)
		//        e.CommitText(ibus.NewText("gittu"))
		return true, nil
	}
	return false, nil
}

func (e *AvroEngine) FocusIn() *dbus.Error {
	fmt.Println("FocusIn")
	e.RegisterProperties(e.propList)
	return nil
}

func (e *AvroEngine) PropertyActivate(prop_name string, prop_state uint32) *dbus.Error {
	fmt.Println("PropertyActivate", prop_name)
	return nil
}

var eid = 0

func AvroEngineCreator(conn *dbus.Conn, engineName string) dbus.ObjectPath {
	fmt.Println("Creating Avro Engine")
	eid++
	objectPath := dbus.ObjectPath(fmt.Sprintf("/org/freedesktop/IBus/Engine/GittuGo/%d", eid))

	propp := ibus.NewProperty(
		"setup",
		ibus.PROP_TYPE_NORMAL,
		"Preferences - Avro",
		"gtk-preferences",
		"Configure Avro",
		true,
		true,
		ibus.PROP_STATE_UNCHECKED)

	engine := &AvroEngine{ibus.BaseEngine(conn, objectPath), ibus.NewPropList(propp)}

	conn.Export(engine, objectPath, ibus.IBUS_IFACE_ENGINE)
	conn.Export(engine, objectPath, ibus.BUS_PROPERTIES_NAME)

	return objectPath
}
