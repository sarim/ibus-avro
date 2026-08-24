#!/usr/bin/env gjs
// =============================================================================
// IBus Avro Suggestion Engine Performance Benchmark
// =============================================================================
imports.searchPath.unshift('.');
const suggestion = imports.suggestionbuilder;
const GLib = imports.gi.GLib;

var builder = new suggestion.SuggestionBuilder();

// Test words list containing various prefixes, common terms, and edge cases
var testWords = [
    "ami", "bangla", "gan", "gai", "tumi", "ki", "korcho", "amader", "desh", "shadhin",
    "priyo", "valobashi", "abbu", "ammu", "bhai", "bon", "khabar", "khabo", "kothay", "jabo",
    "shundor", "dhaka", "bangladesh", "jonno", "kotha", "bolte", "chi", "parbo", "na", "keno"
];

print("====================================================");
print("Starting benchmark of Avro Phonetic Suggestion Engine...");
print("Test words count: " + testWords.length);
print("Iterations: 1000 (Total suggestions processed: " + (testWords.length * 1000) + ")");
print("====================================================");

// 1. Warm-up phase (to let JIT compiler optimize)
for (var i = 0; i < 50; i++) {
    for (var j = 0; j < testWords.length; j++) {
        builder.suggest(testWords[j]);
    }
}

// 2. Performance Measurement
var startTime = GLib.get_monotonic_time(); // Time in microseconds

var iterations = 1000;
for (var i = 0; i < iterations; i++) {
    for (var j = 0; j < testWords.length; j++) {
        builder.suggest(testWords[j]);
    }
}

var endTime = GLib.get_monotonic_time();
var durationMs = (endTime - startTime) / 1000.0;

print("Processed " + (iterations * testWords.length) + " suggestions.");
print("Total duration: " + durationMs.toFixed(2) + " ms");
print("Average time per suggestion: " + (durationMs / (iterations * testWords.length)).toFixed(4) + " ms");
print("====================================================");
