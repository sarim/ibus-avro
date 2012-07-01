imports.searchPath.unshift('.');
const Avroparser = imports.avrolib.OmicronLab.Avro.Phonetic;

function suggest (word){
return [Avroparser.parse(word),word,"টেস্ট নং 1","Test no 2"];
}
