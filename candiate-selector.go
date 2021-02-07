package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
)

type PersistentCandidateSelector struct {
	data     map[string]string
	filePath string
	dirPath  string
}

func pathExists(path string) bool {
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false
	}

	return true
}

func (cs *PersistentCandidateSelector) Load() error {
	if !pathExists(cs.filePath) {
		return nil
	}

	jsonBytes, err := ioutil.ReadFile(cs.filePath)
	if err != nil {
		fmt.Println("cannot read candidateSelectionFile", cs.filePath, err)
		return err
	}

	json.Unmarshal(jsonBytes, &cs.data)
	if err != nil {
		return err
	}

	return nil
}

func (cs *PersistentCandidateSelector) Save() error {
	if !pathExists(cs.dirPath) {
		err := os.MkdirAll(cs.dirPath, os.ModePerm)
		if err != nil {
			fmt.Println("cannot create directory", cs.dirPath, err)
			return err
		}
	}

	jsonBytes, err := json.Marshal(cs.data)
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(cs.filePath, jsonBytes, 0644)
	if err != nil {
		fmt.Println("cannot write to candidateSelectionFile", err)
		return err
	}

	return nil
}

func (cs *PersistentCandidateSelector) Has(candidate string) bool {
	_, ok := cs.data[candidate]
	return ok
}

func (cs *PersistentCandidateSelector) Get(candidate string, suggestions []string) (int, string, bool) {
	prev, ok := cs.data[candidate]
	if ok {
		for i, v := range suggestions {
			if v == prev {
				return i, v, true
			}
		}
	}
	return 0, suggestions[0], false
}

func (cs *PersistentCandidateSelector) Set(candidate string, suggestion string) error {
	cs.data[candidate] = suggestion
	return nil
}

func NewPersistentCandidateSelector() *PersistentCandidateSelector {
	cs := &PersistentCandidateSelector{}

	cs.data = make(map[string]string)

	homeDir, _ := os.UserHomeDir()
	dirPath := filepath.Join(homeDir, ".config", "ibus-avro")
	cs.dirPath = dirPath
	cs.filePath = filepath.Join(dirPath, "candidate-selections.json")

	cs.Load()

	return cs
}
