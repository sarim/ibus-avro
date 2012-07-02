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


imports.searchPath.unshift('.');
const dictsearch = imports.dbsearch;
const autocorrectdb = imports.autocorrect.db;
const Avroparser = imports.avrolib.OmicronLab.Avro.Phonetic;
const utfconv = imports.utf8;
const EditDistance = imports.levenshtein;

function SuggestionBuilder(){
    this._init();
}

SuggestionBuilder.prototype = {
    
    _init: function(){
        this._dbSearch = new dictsearch.DBSearch ();
    },
    
    
    _getDictionarySuggestion: function(splitWord){
        var words = [];
        words = this._dbSearch.search(splitWord['middle']);
        return words;
    },
    
    
    _getClassicPhonetic: function(banglish){
        return utfconv.utf8Decode(Avroparser.parse(banglish));
    },
    
    
    _correctCase:function (banglish){
        //TODO: Correct case here
        return banglish;
    },
    
    
    _getAutocorrect: function(word, splitWord){
        var corrected = '';
        
        //Search for whole match
        if(autocorrectdb[word]){
            // [smiley rule]
            if (autocorrectdb[word] == word){
                corrected = word;
            } else {
                corrected = this._getClassicPhonetic(autocorrectdb[word]);
            }
        } else {
            //Whole word is not present, search without padding
            var correctedMiddle = this._correctCase(splitWord['middle']);
             if(autocorrectdb[correctedMiddle]){
                corrected = this._getClassicPhonetic(autocorrectdb[correctedMiddle]);
            }
        }
        
        return corrected;
    },
    
    
    _separatePadding: function(word){
        //TODO: Complete this dummy Function
        var splitWord = {};
        splitWord['begin'] = '';
        splitWord['middle'] = word;
        splitWord['end'] = '';
        
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
    
    
    _joinSuggestion: function(autoCorrect, dictSuggestion, phonetic, splitWord){
        var words = [];
        
        //1st Item: Autocorrect
        if (autoCorrect.length > 0){
            words.push(autoCorrect);
        }
        
        //2nd Item: Classic Avro Phonetic
        this._addToArray(words, phonetic);
        
        //3rd Item: Dictionary Avro Phonetic
        var sortedWords = this._sortByPhoneticRelevance(phonetic, dictSuggestion);
        for (i in sortedWords){
            this._addToArray(words, sortedWords[i]);
        }
        
        //Add padding to all
        for (i in words){
            words[i] = splitWord['begin'] + words[i] + splitWord['end'];
        }
        
        return words;
    },
    
    
    _getPreviousSelection: function (splitWord){
        //TODO: Complete this dummy Function
        return 0;
    },
    
    
    saveCandidateSelection: function(word, candidate){
        //TODO: Complete this dummy Function
    },
    
    
    suggest: function(word){
        //Seperate begining and trailing padding characters, punctuations etc. from whole word
        var splitWord = this._separatePadding(word);
        
        //Convert begining and trailing padding text to phonetic Bangla
        splitWord['begin'] = this._getClassicPhonetic(splitWord['begin']);
        splitWord['end'] = this._getClassicPhonetic(splitWord['end']);
        
        //Convert the word to Bangla using 3 separate methods 
        var phonetic = this._getClassicPhonetic(splitWord['middle']);
        var dictSuggestion = this._getDictionarySuggestion(splitWord);
        var autoCorrect = this._getAutocorrect(word, splitWord);

        //Prepare suggestion object
        var suggestion = {};
        //Is there any previous custom selection of the user?
        suggestion['prevSelection'] = this._getPreviousSelection(splitWord);
        suggestion['words'] = this._joinSuggestion(autoCorrect, dictSuggestion, phonetic, splitWord);
        
        return suggestion;
    }
}

var logger = function (obj, msg){
	print ((msg || 'Log') + ': ' + JSON.stringify(obj, null, '\t'));
}

function test(word){
    var suggestionBuilder = new SuggestionBuilder();
    var suggestion = suggestionBuilder.suggest(word);
    logger(suggestion);
}

//test('ki');
