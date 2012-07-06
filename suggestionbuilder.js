/*
    =============================================================================
    *****************************************************************************
    The contents of this file are subject to the Mozilla Public License
    Version 1.1 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License at
    http://www.mozilla.org/MPL/

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
    
    
    _sortByPhoneticRelevance: function (phonetic, dictSuggestion){
        //Copy array
        var sortedSuggestion = dictSuggestion.slice(0);
        
        sortedSuggestion.sort(function(a, b){
            var da = EditDistance.levenshtein(phonetic, a);
            var db = EditDistance.levenshtein(phonetic, b);

            if (da < db){
                 return -1;  
            } else if (da > db){
                 return 1;  
            } else{
                return 0;
            }
        });
        
        return sortedSuggestion;
    },
    
    _addToArray: function (arr,item) {
        if (arr.indexOf(item) == -1){
            arr.push(item);
        }
    },
    
    
    _convertToUnicodeValue: function(input){
        var output = '';

        for (var i = 0; i < input.length; i++){
            var charCode = input.charCodeAt(i);
            if (charCode >= 255){
                output += '\\u0' + charCode.toString(16);
            } else {
                output += input.charAt(i);
            }
        }
        return output;
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
                        
                        for (i in tempList){
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

                var sortedWords = this._sortByPhoneticRelevance(phonetic, dictSuggestionWithSuffix);
                for (i in sortedWords){
                    this._addToArray(words, sortedWords[i]);
                }
        
                /* 3rd Item: Classic Avro Phonetic */
                this._addToArray(words, phonetic);
        
                var suggestion = {};
        
                //Is there any previous custom selection of the user?
                suggestion['prevSelection'] = this._getPreviousSelection(splitWord, words);
        
                //Add padding to all, except exact autocorrect
                for (i in words){
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
    
    
    _getPreviousSelection: function (splitWord, suggestionWords){
        var word = splitWord['middle'];
        var len = word.length;
        var selectedWord = '';
        
        if (this._candidateSelections[word]){
            selectedWord = this._candidateSelections[word];
        } else {
            //Full word was not found, try checking without suffix
            if (len >= 2){
                for (var j = 1; j < len; j++){
                    var testSuffix = word.substr(-j).toLowerCase();

                    var suffix = suffixDict[testSuffix];
                    if (suffix){
                        var key = word.substr(0, word.length - testSuffix.length);

                        if (this._candidateSelections[key]){

                            //Get possible words for key
                            var keyWord = this._candidateSelections[key];

                            var kwRightChar = keyWord.substr(-1);
                            var suffixLeftChar = suffix.substr(0, 1);

                            var selectedWord = '';

                            if (this._isVowel(kwRightChar) && this._isKar(suffixLeftChar)){
                                 selectedWord = keyWord + "\u09df" + suffix; // \u09df = B_Y
                             } else {
                                 if (kwRightChar == "\u09ce"){ // \u09ce = b_Khandatta
                                     selectedWord = keyWord.substr(0, keyWord.length - 1) + "\u09a4" + suffix; // \u09a4 = b_T
                                 } else if (kwRightChar == "\u0982"){ // \u0982 = b_Anushar
                                     selectedWord = keyWord.substr(0, keyWord.length - 1) + "\u0999" + suffix; // \u09a4 = b_NGA
                                 } else {
                                     selectedWord = keyWord + suffix;
                                 }
                             }
                             
                             //Save this referrence
                            this._updateCandidateSelection(word, selectedWord);
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
                /*
                var file_stream = file.read(null);
                var data_stream = gio.DataInputStream.new(file_stream);
                var json = data_stream.read_until("", null);
                this._candidateSelections = JSON.parse(json[0]);
                */
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
            } else {
                this._candidateSelections = {};
            }
        } catch (e){
           this._candidateSelections = {};
           this._logger(e, 'Error in _loadCandidateSelectionsFromFile');
        }
    },
    
    
    _saveCandidateSelectionsToFile: function(){
        try {
            var file = gio.File.new_for_path ( GLib.get_home_dir() + "/.candidate-selections.json");
            
            if (file.query_exists (null)) {
                file.delete (null);
            }
            /*
            var file_stream = file.create (gio.FileCreateFlags.NONE, null);
            var json = JSON.stringify(this._candidateSelections);
            json = this._convertToUnicodeValue(json);
            // Write text data to file
            var data_stream =  gio.DataOutputStream.new (file_stream);
            data_stream.put_string (json, null);
            */
            var that = this;
            // Create a new file with this name
            file.create_async(gio.FileCreateFlags.NONE, 0, null, 
                    function(source, result){
                        var file_stream = source.create_finish(result);
                        
                        if (file_stream){
                            var json = JSON.stringify(that._candidateSelections);
                            json = that._convertToUnicodeValue(json);

                            // Write text data to file
                            var data_stream =  gio.DataOutputStream.new (file_stream);
                            data_stream.put_string (json, null);
                        } else {
                            this._logger(e, 'Error in _saveCandidateSelectionsToFile');
                        }
                    });
        } catch (e) {
           this._logger(e, '_saveCandidateSelectionsToFile Error');
       }
    },


    _updateCandidateSelection: function(word, candidate){
        this._candidateSelections[word] = candidate;
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
        
        //If it is called, user made the final decision here
        
        //Check and save selection without suffix if that is not present
        if (this._tempCache[candidate]){
            var base = this._tempCache[candidate].base;
            var eng = this._tempCache[candidate].eng;
            //Don't overwrite existing value
            if (!this._candidateSelections[eng]){
                this._candidateSelections[eng] = base;
                this._saveCandidateSelectionsToFile();
            }
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
