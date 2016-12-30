package main

import (
	"fmt"

	"github.com/godbus/dbus"
	"github.com/sarim/goibus/ibus"
)

type AvroEngine struct {
	ibus.Engine
	propList *ibus.PropList
	u        *AvroUtil
}

func (e *AvroEngine) ProcessKeyEvent(keyval uint32, keycode uint32, state uint32) (bool, *dbus.Error) {
	fmt.Println("Process Key Event > ", keyval, keycode, state)

	return e.u.ProcessKeyEvent(keyval, keycode, state), nil
}

func (e *AvroEngine) CandidateClicked(index uint32, button uint32, state uint32) *dbus.Error {
	if len(e.u.State.BufferText) > 0 {
		e.u.State.CurrentSelection = int(index)
		e.u.PreeditCandidate()
		//JS: suggestionBuilder.updateCandidateSelection(engine.buffertext, engine.currentSuggestions[engine.currentSelection]);
		fmt.Println("User Clicked Candidate > ", index, button, state)
	}
	return nil
}

func (e *AvroEngine) FocusOut() *dbus.Error {
	fmt.Println("FocusOut")
	if len(e.u.State.BufferText) > 0 {
		e.u.CommitCandidate()
	}
	return nil
}

func (e *AvroEngine) FocusIn() *dbus.Error {
	fmt.Println("FocusIn")
	e.RegisterProperties(e.propList)
	return nil
}

func (e *AvroEngine) PropertyActivate(prop_name string, prop_state uint32) *dbus.Error {
	fmt.Println("PropertyActivate", prop_name)
	e.u.RunPreferences()
	return nil
}
