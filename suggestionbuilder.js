/*
    =============================================================================
    *****************************************************************************
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at https://mozilla.org/MPL/2.0/.

    Software distributed under the License is distributed on an "AS IS"
    basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
    License for the specific language governing rights and limitations
    under the License.

    The Original Code is jsAvroPhonetic

    The Initial Developer of the Original Code is
    Mehdi Hasan Khan <mhasan@omicronlab.com>

    Copyright (C) OmicronLab (http://www.omicronlab.com). All Rights Reserved.


    Contributor(s): ______________________________________.

    *****************************************************************************
    =============================================================================
*/

const gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

const dictsearch = imports.dbsearch;
const autocorrectdb = imports.autocorrect.db;
const Avroparser = imports.avrolib.OmicronLab.Avro.Phonetic;
const utfconv = imports.utf8;
const EditDistance = imports.levenshtein;
const suffixDict = imports.suffixdict.db;

function SuggestionBuilder(){
    this._init();
}

SuggestionBuilder.prototype = {
    
    _init: function(){
        this._dbSearch = new dictsearch.DBSearch ();
        this._candidateSelections = {};
        this._phoneticCache = {};
        this._loadCandidateSelectionsFromFile();
        this._tempCache = {};
        this._pref = this._defaultPref();
        this._saveTimeoutId = 0;
        this._dirty = false;
    },
    
    
    _defaultPref: function(){
        var pref = {};
        pref.dictEnable = true;
        
        return pref;
    },
    
    
    _getDictionarySuggestion: function(splitWord){
        var words = [];
        
        var key = splitWord['middle'].toLowerCase();
        
        if (this._phoneticCache[key]){
            words = this._phoneticCache[key].slice(0);
        } else {
            words = this._dbSearch.search(key);
        }
        return words;
    },
    
    
    _getClassicPhonetic: function(banglish){
        return utfconv.utf8Decode(Avroparser.parse(banglish));
    },
    
    
    _correctCase:function (banglish){
        return Avroparser.fixString(banglish);
    },
    
    
    _getAutocorrect: function(word, splitWord){
        var corrected = {};
        
        //Search for whole match
        if(autocorrectdb[word]){
            // [smiley rule]
            if (autocorrectdb[word] == word){
                corrected['corrected'] = word;
                corrected['exact'] = true;
            } else {
                corrected['corrected'] = this._getClassicPhonetic(autocorrectdb[word]);
                corrected['exact'] = false;
            }
        } else {
            //Whole word is not present, search without padding
            var correctedMiddle = this._correctCase(splitWord['middle']);
            if(autocorrectdb[correctedMiddle]){
                corrected['corrected'] = this._getClassicPhonetic(autocorrectdb[correctedMiddle]);
                corrected['exact'] = false;
            }
        }
        
        return corrected;
    },
    
    
    _separatePadding: function(word){
        // Feeling lost? Ask Rifat :D
        var match = word.match(/(^(?::`|\.`|[\-\]~!@#%&*()_=+[{}'";<>\/?|.,])*?(?=(?:,{2,}))|^(?::`|\.`|[\-\]~!@#%&*()_=+[{}'";<>\/?|.,])*)(.*?(?:,,)*)((?::`|\.`|[\-\]~!@#%&*()_=+[{}'";<>\/?|.,])*$)/);
        
        var splitWord = {};
        splitWord['begin'] = match[1];
        splitWord['middle'] = match[2];
        splitWord['end'] = match[3];
        
        return splitWord;
    },
    
    
    _sortByPhoneticRelevance: function (phonetic, dictSuggestion, searchKey){
        var freqMap = {};
        // Build a frequency map for words the user has previously chosen for this key
        if (searchKey && this._candidateSelections[searchKey]) {
            var entry = this._candidateSelections[searchKey];
            // Support both legacy string format and new metadata object format
            if (typeof entry === 'string') {
                freqMap[entry] = 1;
            } else if (typeof entry === 'object' && entry !== null) {
                for (var bw in entry) {
                    freqMap[bw] = entry[bw].freq || 1;
                }
            }
        }

        var list = [];
        var len = dictSuggestion.length;
        for (var i = 0; i < len; ++i) {
            var item = dictSuggestion[i];
            var freq = freqMap[item] || 0;
            // Subtract a boost so frequently chosen words sort lower (i.e. first)
            var score = EditDistance.levenshtein(phonetic, item) - (freq > 0 ? (10 + freq) : 0);
            list.push({ item: item, score: score });
        }
        
        list.sort(function(a, b){
            return a.score - b.score;
        });
        
        var sortedSuggestion = [];
        for (var i = 0; i < len; ++i) {
            sortedSuggestion.push(list[i].item);
        }
        
        return sortedSuggestion;
    },
    
    _addToArray: function (arr,item) {
        if (arr.indexOf(item) == -1){
            arr.push(item);
        }
    },
    
    
    _isKar: function(input){
        if (input.length < 1){
            return false;
        }
        var cInput = input.charAt(0);
        return /^[\u09be\u09bf\u09c0\u09c1\u09c2\u09c3\u09c7\u09c8\u09cb\u09cc\u09c4]$/.test(cInput);
    },
    
    
    _isVowel: function(input){
        if (input.length < 1){
            return false;
        }
        var cInput = input.charAt(0);
        return /^[\u0985\u0986\u0987\u0988\u0989\u098a\u098b\u098f\u0990\u0993\u0994\u098c\u09e1\u09be\u09bf\u09c0\u09c1\u09c2\u09c3\u09c7\u09c8\u09cb\u09cc]$/.test(cInput);
    },    
    
    
    _addToTempCache: function(full, base, eng){
        //Don't overwrite
        if (!this._tempCache[full]){
            this._tempCache[full] = {};
            this._tempCache[full].base = base;
            this._tempCache[full].eng = eng;
        }
    },
    
    
    _addSuffix: function(splitWord){
        var tempList = [];
        var fullWord = '';
        var word = splitWord['middle'].toLowerCase();
        var len = word.length;
        
        var rList = [];
        if (this._phoneticCache[word]){
           rList = this._phoneticCache[word].slice(0);
        }
        
        this._tempCache = {};
        
        if (len >= 2){
            for (var j = 1; j <= len; j++){
                var testSuffix = word.substr(j, len);
                
                var suffix = suffixDict[testSuffix];
                if (suffix){
                    var key = word.substr(0, word.length - testSuffix.length); 
                    if (this._phoneticCache[key]){
                        for (var k = 0; k < this._phoneticCache[key].length; k++){
                            var cacheItem = this._phoneticCache[key][k];
                            var cacheRightChar = cacheItem.substr(-1);
                            var suffixLeftChar = suffix.substr(0, 1);
                            if (this._isVowel(cacheRightChar) && this._isKar(suffixLeftChar)){
                                fullWord = cacheItem + "\u09df" + suffix; // \u09df = B_Y
                                tempList.push(fullWord);
                                this._addToTempCache(fullWord, cacheItem, key);
                            } else {
                                if (cacheRightChar == "\u09ce"){ // \u09ce = b_Khandatta
                                    fullWord = cacheItem.substr(0, cacheItem.length - 1) + "\u09a4" + suffix; // \u09a4 = b_T
                                    tempList.push(fullWord);
                                    this._addToTempCache(fullWord, cacheItem, key);
                                } else if (cacheRightChar == "\u0982"){ // \u0982 = b_Anushar
                                    fullWord = cacheItem.substr(0, cacheItem.length - 1) + "\u0999" + suffix; // \u09a4 = b_NGA
                                    tempList.push(fullWord);
                                } else {
                                    fullWord = cacheItem + suffix;
                                    tempList.push(fullWord);
                                    this._addToTempCache(fullWord, cacheItem, key);
                                }
                            }
                        }
                        
                        for (var i = 0; i < tempList.length; i++){
                            rList.push(tempList[i]);
                        }
                    }
                }
            }
        }
        
        return rList;
    },
    
    
    _joinSuggestion: function(autoCorrect, dictSuggestion, phonetic, splitWord){
        var words = [];
        
        if (!this._pref.dictEnable){
                words.push(phonetic);
                words[0] = splitWord['begin'] + words[0] + splitWord['end'];
            
                var suggestion = {};
                suggestion['words'] = words;
                suggestion['prevSelection'] = 0;
        } else {

                /* 1st Item: Autocorrect */
                if (autoCorrect['corrected']){
                    words.push(autoCorrect['corrected']);
                    //Add autocorrect entry to dictSuggestion for suffix support
                    if (!autoCorrect['exact']){
                        dictSuggestion.push(autoCorrect['corrected']);
                    }
                }
        
        
                /* 2rd Item: Dictionary Avro Phonetic */
                //Update Phonetic Cache
                if(!this._phoneticCache[splitWord['middle'].toLowerCase()]){
                    if (dictSuggestion.length > 0){
                        this._phoneticCache[splitWord['middle'].toLowerCase()] = dictSuggestion.slice(0);
                    }
                }
                //Add Suffix
                var dictSuggestionWithSuffix = this._addSuffix(splitWord);

                var sortedWords = this._sortByPhoneticRelevance(phonetic, dictSuggestionWithSuffix, splitWord['middle'].toLowerCase());
                for (var i = 0; i < sortedWords.length; i++){
                    this._addToArray(words, sortedWords[i]);
                }
        
                /* 3rd Item: Classic Avro Phonetic */
                this._addToArray(words, phonetic);
        
                var suggestion = {};
        
                //Is there any previous custom selection of the user?
                suggestion['prevSelection'] = this._getPreviousSelection(splitWord, words);
        
                //Add padding to all, except exact autocorrect
                for (var i = 0; i < words.length; i++){
                    if (autoCorrect['exact']){
                        if (autoCorrect['corrected'] != words[i]){
                            words[i] = splitWord['begin'] + words[i] + splitWord['end'];
                        }
                    } else {
                        words[i] = splitWord['begin'] + words[i] + splitWord['end'];   
                    }
                }
        
                suggestion['words'] = words;
        
        }
    
        return suggestion;
    },
    
    
    // Returns the last-selected word string for a given key, supporting both
    // legacy string values and new metadata object format.
    _getPreviousSelectionString: function(key){
        var entry = this._candidateSelections[key];
        if (!entry) return '';
        if (typeof entry === 'string') return entry;
        // New format: { 'word': { freq: N, lastSelected: T }, ... }
        // Return the word with the highest frequency
        var bestWord = '';
        var bestFreq = -1;
        for (var bw in entry) {
            if (entry[bw].freq > bestFreq) {
                bestFreq = entry[bw].freq;
                bestWord = bw;
            }
        }
        return bestWord;
    },


    _getPreviousSelection: function (splitWord, suggestionWords){
        var word = splitWord['middle'];
        var len = word.length;
        var selectedWord = '';
        
        selectedWord = this._getPreviousSelectionString(word);

        if (!selectedWord) {
            //Full word was not found, try checking without suffix
            if (len >= 2){
                for (var j = 1; j < len; j++){
                    var testSuffix = word.substr(-j).toLowerCase();

                    var suffix = suffixDict[testSuffix];
                    if (suffix){
                        var key = word.substr(0, word.length - testSuffix.length);

                        var keyWord = this._getPreviousSelectionString(key);

                        if (keyWord) {
                            var kwRightChar = keyWord.substr(-1);
                            var suffixLeftChar = suffix.substr(0, 1);

                            var derivedWord = '';

                            if (this._isVowel(kwRightChar) && this._isKar(suffixLeftChar)){
                                 derivedWord = keyWord + "\u09df" + suffix; // \u09df = B_Y
                             } else {
                                 if (kwRightChar == "\u09ce"){ // \u09ce = b_Khandatta
                                     derivedWord = keyWord.substr(0, keyWord.length - 1) + "\u09a4" + suffix; // \u09a4 = b_T
                                 } else if (kwRightChar == "\u0982"){ // \u0982 = b_Anushar
                                     derivedWord = keyWord.substr(0, keyWord.length - 1) + "\u0999" + suffix; // \u09a4 = b_NGA
                                 } else {
                                     derivedWord = keyWord + suffix;
                                 }
                             }
                             
                             //Save this reference
                            this._recordSelection(word, derivedWord, false);
                            selectedWord = derivedWord;
                            break;
                        }
                    }
                }
            }
        }
        
        var i = suggestionWords.indexOf(selectedWord);
        return (i < 0) ? i = 0 : i;
    },
    
    
    _loadCandidateSelectionsFromFile: function(){
        try {
            var file = gio.File.new_for_path(GLib.get_home_dir() + "/.candidate-selections.json");
        
            if (file.query_exists (null)) {
                
                var file_stream = file.read(null);
                var data_stream = gio.DataInputStream.new(file_stream);
                var json = data_stream.read_until("", null);
                this._candidateSelections = JSON.parse(json[0]) || {};
                
                /*
                file.read_async(0, null,
                		function(source, result){
                		    var file_stream = source.read_finish(result);
                		    
                		    if (file_stream){
                		        var data_stream = gio.DataInputStream.new(file_stream);
                                var json = data_stream.read_until("", null);
                                this._candidateSelections = JSON.parse(json[0]);
                		    } else {
                		        this._logger(e, 'Error in _loadCandidateSelectionsFromFile');
                		    }
                		});
                */
            } else {
                this._candidateSelections = {};
            }
        } catch (e){
           this._candidateSelections = {};
           this._logger(e, 'Error in _loadCandidateSelectionsFromFile');
        }
    },
    
    
    _pruneCandidateSelections: function() {
        var keys = Object.keys(this._candidateSelections);
        if (keys.length <= 2000) return;

        var keyTimes = [];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var entry = this._candidateSelections[key];
            var maxTime = 0;
            if (typeof entry === 'string') {
                maxTime = 0;
            } else if (typeof entry === 'object' && entry !== null) {
                for (var candidate in entry) {
                    if (entry[candidate].lastSelected > maxTime) {
                        maxTime = entry[candidate].lastSelected;
                    }
                }
            }
            keyTimes.push({ key: key, time: maxTime });
        }

        keyTimes.sort(function(a, b) {
            return b.time - a.time;
        });

        for (var i = 1500; i < keyTimes.length; i++) {
            delete this._candidateSelections[keyTimes[i].key];
        }
    },


    _saveCandidateSelectionsToFile: function(){
        this._dirty = true;
        if (this._saveTimeoutId) {
            GLib.source_remove(this._saveTimeoutId);
            this._saveTimeoutId = 0;
        }
        var that = this;
        this._saveTimeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, function() {
            that._saveTimeoutId = 0;
            that._flushSave();
            return GLib.SOURCE_REMOVE;
        });
    },


    _flushSave: function() {
        if (!this._dirty) return;
        this._dirty = false;
        try {
            this._pruneCandidateSelections();
            var json = JSON.stringify(this._candidateSelections);
            var bytes = GLib.Bytes.new(json);
            var file = gio.File.new_for_path(GLib.get_home_dir() + "/.candidate-selections.json");
            file.replace_contents_async(
                bytes,
                null,
                false,
                gio.FileCreateFlags.NONE,
                null,
                function(source, result) {
                    try {
                        source.replace_contents_finish(result);
                    } catch (e) {
                        // ignore/log error
                    }
                }
            );
        } catch (e) {
           this._logger(e, '_flushSave Error');
        }
    },


    // Central helper to record a word selection in memory.
    // incrementFreq=true: user committed the word (Space/Enter/Click).
    // incrementFreq=false: user is navigating suggestions (preview only).
    _recordSelection: function(eng, candidate, incrementFreq){
        if (!eng || !candidate) return;
        var entry = this._candidateSelections[eng];

        // Migrate legacy string format to metadata object on first write
        if (typeof entry === 'string') {
            var legacyWord = entry;
            this._candidateSelections[eng] = {};
            this._candidateSelections[eng][legacyWord] = { freq: 1, lastSelected: Date.now() };
            entry = this._candidateSelections[eng];
        } else if (typeof entry !== 'object' || entry === null) {
            this._candidateSelections[eng] = {};
            entry = this._candidateSelections[eng];
        }

        if (!entry[candidate]) {
            entry[candidate] = { freq: 0, lastSelected: 0 };
        }

        if (incrementFreq) {
            entry[candidate].freq += 1;
        }
        entry[candidate].lastSelected = Date.now();
    },


    _updateCandidateSelection: function(word, candidate){
        this._recordSelection(word, candidate, false);
    },
    
    
    
    _logger: function (obj, msg){
    	print ((msg || 'Log') + ': ' + JSON.stringify(obj, null, '\t'));
    },
    
    
    getPref: function(){
        return this._pref;
    },
    
    
    setPref: function(pref){
        //TODO: Add Validation
        this._pref = pref;
    },
    
    
    stringCommitted: function(word, candidate){
        if (!this._pref.dictEnable){
            return;
        }
        
        // User made the final commit. Increment frequency for this word.
        var splitWord = this._separatePadding(word);
        this._recordSelection(splitWord['middle'], candidate, true);

        // Also record without suffix if suffix data is available in tempCache
        if (this._tempCache[candidate]){
            var base = this._tempCache[candidate].base;
            var eng = this._tempCache[candidate].eng;
            this._recordSelection(eng, base, true);
        }
        
        this._saveCandidateSelectionsToFile();
    },
    
    
    updateCandidateSelection: function(word, candidate){
        if (!this._pref.dictEnable){
            return;
        }
        
        //Seperate begining and trailing padding characters, punctuations etc. from whole word
        var splitWord = this._separatePadding(word);
        this._updateCandidateSelection(splitWord['middle'], candidate);
    },
    
    
    suggest: function(word){
        //Seperate begining and trailing padding characters, punctuations etc. from whole word
        var splitWord = this._separatePadding(word);
        
        //Convert begining and trailing padding text to phonetic Bangla
        splitWord['begin'] = this._getClassicPhonetic(splitWord['begin']);
        splitWord['end'] = this._getClassicPhonetic(splitWord['end']);
        
        //Convert the word to Bangla using 3 separate methods 
        var phonetic = this._getClassicPhonetic(splitWord['middle']);
        
        if (this._pref.dictEnable){
            var dictSuggestion = this._getDictionarySuggestion(splitWord);
            var autoCorrect = this._getAutocorrect(word, splitWord);
        }

        //Prepare suggestion object
        var suggestion = this._joinSuggestion(autoCorrect, dictSuggestion, phonetic, splitWord);
        
        return suggestion;
    }
}
