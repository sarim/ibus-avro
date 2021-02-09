package main

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/sarim/avro-go/avrophonetic"
	"github.com/sarim/goibus/ibus"
)

type AvroSettingStorage interface {
	GetBool(key string) bool
	GetInt(key string) int
	GetString(key string) string
	SetBool(key string, value bool) error
	SetInt(key string, value int) error
	SetString(key string, value string) error
}

type AvroSetting struct {
	Preview         bool
	EnableDict      bool
	EnterNewline    bool
	Orientation     int
	LookupTableSize int
}

type AvroEngineState struct {
	CurrentSuggestions []string
	CurrentSelection   int
	BufferText         string
	LookupTable        *ibus.LookupTable
}

func (s *AvroEngineState) CurrentCandidate() string {
	if len(s.CurrentSuggestions) <= s.CurrentSelection {
		return ""
	}
	return s.CurrentSuggestions[s.CurrentSelection]
}

type AvroUtil struct {
	Setting           AvroSetting
	State             AvroEngineState
	Engine            *AvroEngine
	SuggestionBuilder *avrophonetic.SuggestionBuilder
}

func (u *AvroUtil) InitSetting() {
	u.Setting.Preview = true
	u.Setting.EnableDict = true
	u.Setting.EnterNewline = true
	u.Setting.Orientation = int(ibus.ORIENTATION_HORIZONTAL)
	u.Setting.LookupTableSize = 15

	u.ReadSetting()

	//TODO: remove ghetto code and implement programatically
	go func(u *AvroUtil) {
		cmd := exec.Command("gsettings", "monitor", "com.omicronlab.avrobeta")
		stdout, err := cmd.StdoutPipe()
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		err = cmd.Start()
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		err = nil
		for buf := make([]byte, 64); err == nil; _, err = stdout.Read(buf) {
			fmt.Println("Settings updated, calling ReadSetting")
			u.ReadSetting()
		}
		cmd.Wait()
	}(u)
}

func (u *AvroUtil) ReadSetting() {
	//TODO: remove ghetto code and implement programatically

	out, err := exec.Command("gsettings", "list-recursively", "com.omicronlab.avrobeta").Output()
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	lines := strings.Split(string(out), "\n")
	for _, line := range lines {
		var id, key, value string
		fmt.Sscanf(line, "%s %s %s", &id, &key, &value)
		switch key {
		case "toggle-preview":
			u.Setting.Preview, _ = strconv.ParseBool(value)
		case "toggle-dict":
			u.Setting.EnableDict, _ = strconv.ParseBool(value)
			u.SuggestionBuilder.Pref.DictDisabled = !u.Setting.EnableDict
		case "toggle-newline":
			u.Setting.Preview, _ = strconv.ParseBool(value)
		case "lutable-size":
			u.Setting.LookupTableSize, _ = strconv.Atoi(value)
		case "lutable-orientation":
			u.Setting.Orientation, _ = strconv.Atoi(value)
		}
	}
}

func (u *AvroUtil) ResetAll() {
	u.State.CurrentSuggestions = []string{}
	u.State.CurrentSelection = 0
	u.State.BufferText = ""

	u.CleanLookupTable()
	u.Engine.HidePreeditText()
	u.Engine.HideAuxiliaryText()
	u.Engine.HideLookupTable()
}

func (u *AvroUtil) CleanLookupTable() {
	u.State.LookupTable = ibus.NewLookupTable()
	u.State.LookupTable.PageSize = uint32(u.Setting.LookupTableSize)
	u.State.LookupTable.Orientation = int32(u.Setting.Orientation)
}

func (u *AvroUtil) ProcessKeyEvent(keyval uint32, keycode uint32, state uint32) bool {
	//ignore release event
	if !(state == 0 || state == 1 || state == 16 || state == 17) {
		return false
	}

	// capture the shift key
	if keycode == 42 {
		return false
	}

	// process letter key events
	if (keyval >= 33 && keyval <= 126) ||
		(keyval >= IBUS_KP_0 && keyval <= IBUS_KP_9) ||
		keyval == IBUS_KP_Add ||
		keyval == IBUS_KP_Decimal ||
		keyval == IBUS_KP_Divide ||
		keyval == IBUS_KP_Multiply ||
		keyval == IBUS_KP_Divide ||
		keyval == IBUS_KP_Subtract {

		// ibus_keyval_to_unicode replaced with string cast
		u.State.BufferText += string(keyval)
		u.UpdateCurrentSuggestions()
		return true

	} else if keyval == IBUS_Return || keyval == IBUS_space || keyval == IBUS_Tab {
		if len(u.State.BufferText) > 0 {
			if keyval == IBUS_Return && len(u.State.BufferText) > 0 && len(u.State.CurrentSuggestions) > 1 && (!u.Setting.EnterNewline) {
				u.CommitCandidate()
				return true
			} else {
				u.CommitCandidate()
			}
		}

	} else if keyval == IBUS_BackSpace {
		if len(u.State.BufferText) > 0 {
			u.State.BufferText = u.State.BufferText[0 : len(u.State.BufferText)-1]
			if len(u.State.BufferText) > 0 {
				u.UpdateCurrentSuggestions()
			}

			if len(u.State.BufferText) <= 0 {
				u.ResetAll()
			}
			return true
		}
	} else if keyval == IBUS_Left || keyval == IBUS_KP_Left || keyval == IBUS_Right || keyval == IBUS_KP_Right {
		if len(u.State.CurrentSuggestions) <= 0 || int32(u.Setting.Orientation) == ibus.ORIENTATION_VERTICAL {
			u.CommitCandidate()
		} else {
			if keyval == IBUS_Left || keyval == IBUS_KP_Left {
				u.DecSelection()
			} else if keyval == IBUS_Right || keyval == IBUS_KP_Right {
				u.IncSelection()
			}

			return true
		}

	} else if keyval == IBUS_Up || keyval == IBUS_KP_Up || keyval == IBUS_Down || keyval == IBUS_KP_Down {
		if len(u.State.CurrentSuggestions) <= 0 || int32(u.Setting.Orientation) == ibus.ORIENTATION_HORIZONTAL {
			u.CommitCandidate()
		} else {
			if keyval == IBUS_Up {
				u.DecSelection()
			} else if keyval == IBUS_Down {
				u.IncSelection()
			}

			return true
		}

	} else if keyval == IBUS_Control_L ||
		keyval == IBUS_Control_R ||
		keyval == IBUS_Insert ||
		keyval == IBUS_KP_Insert ||
		keyval == IBUS_Delete ||
		keyval == IBUS_KP_Delete ||
		keyval == IBUS_Home ||
		keyval == IBUS_KP_Home ||
		keyval == IBUS_Page_Up ||
		keyval == IBUS_KP_Page_Up ||
		keyval == IBUS_Page_Down ||
		keyval == IBUS_KP_Page_Down ||
		keyval == IBUS_End ||
		keyval == IBUS_KP_End ||
		keyval == IBUS_Alt_L ||
		keyval == IBUS_Alt_R ||
		keyval == IBUS_Super_L ||
		keyval == IBUS_Super_R ||
		keyval == IBUS_Return ||
		keyval == IBUS_space ||
		keyval == IBUS_Tab ||
		keyval == IBUS_KP_Enter {

		u.CommitCandidate()
	}
	return false
}

func (u *AvroUtil) UpdateCurrentSuggestions() {
	suggestion := u.SuggestionBuilder.Suggest(u.State.BufferText)
	fmt.Printf("UpdateCurrentSuggestions: BufferText, Suggestions > %q, %q\n", u.State.BufferText, suggestion)
	if len(suggestion.Words) > u.Setting.LookupTableSize {
		u.State.CurrentSuggestions = suggestion.Words[0:u.Setting.LookupTableSize]
	} else {
		u.State.CurrentSuggestions = suggestion.Words
	}
	u.State.CurrentSelection = suggestion.PrevSelection

	u.FillLookupTable()
}

func (u *AvroUtil) FillLookupTable() {
	if u.Setting.Preview {
		auxiliaryText := ibus.NewText(u.State.BufferText)
		u.Engine.UpdateAuxiliaryText(auxiliaryText, true)

		if u.Setting.EnableDict {
			//TODO: implement
			//u.State.LookupTable.Clear

			u.CleanLookupTable()

			for _, word := range u.State.CurrentSuggestions {
				u.State.LookupTable.AppendCandidate(word)
				//default, ibus sets "1,2,3,4...." as label, i didn't find how to hide it,but a empty string can partially hide it
				u.State.LookupTable.AppendLabel("")
			}
		}
	}
	u.PreeditCandidate()
}

func (u *AvroUtil) PreeditCandidate() {
	if u.Setting.Preview {
		if u.Setting.EnableDict {
			u.State.LookupTable.CursorPos = uint32(u.State.CurrentSelection)
			u.Engine.UpdateLookupTable(u.State.LookupTable, true)
		}
	}

	preeditText := u.State.CurrentCandidate()
	u.Engine.UpdatePreeditTextWithMode(ibus.NewText(preeditText), uint32(len(preeditText)), true, ibus.IBUS_ENGINE_PREEDIT_COMMIT)
}

func (u *AvroUtil) CommitCandidate() {
	u.CommitCandidateWithMode(false)
}

func (u *AvroUtil) CommitCandidateWithMode(internal bool) {
	if len(u.State.BufferText) > 0 {
		if !internal {
			commitText := ibus.NewText(u.State.CurrentCandidate())
			u.Engine.CommitText(commitText)
		}
		u.SuggestionBuilder.StringCommitted(u.State.BufferText, u.State.CurrentCandidate())
	}

	u.ResetAll()
}

func (u *AvroUtil) IncSelection() {
	lastIndex := len(u.State.CurrentSuggestions) - 1
	if (u.State.CurrentSelection + 1) > lastIndex {
		u.State.CurrentSelection = -1
	}
	u.State.CurrentSelection++
	u.PreeditCandidate()

	//Not implemented in GO bcz i think its not needed. StringCommitted in CommitCandidate is enough
	//JS: suggestionBuilder.updateCandidateSelection(u.State.BufferText, u.State.CurrentSuggestions[engine.currentSelection])
}

func (u *AvroUtil) DecSelection() {
	if u.State.CurrentSelection < 1 {
		u.State.CurrentSelection = len(u.State.CurrentSuggestions)
	}
	u.State.CurrentSelection--
	u.PreeditCandidate()

	//See IncSelection last comment
}

func (u *AvroUtil) RunPreferences() {
	cmd := exec.Command(filepath.Join(*prefix, "lib", "ibus", setupBinary))
	cmd.Start()

}
