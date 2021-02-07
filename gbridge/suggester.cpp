#include "suggester.h"

struct _AvroSuggester
{
    GObject parent_instance;

    GjsContext *gjs;
};

G_DEFINE_TYPE(AvroSuggester, avro_suggester, G_TYPE_OBJECT)

/* class initializer, called only once */
static void
avro_suggester_class_init(AvroSuggesterClass *klass)
{
}

/* instance initializer */
static void
avro_suggester_init(AvroSuggester *self)
{
    const char *program_name = "suggester.js";

    self->gjs = (GjsContext *)g_object_new(GJS_TYPE_CONTEXT,
                                           "search-path", NULL,
                                           "program-name", program_name,
                                           "profiler-enabled", false,
                                           NULL);

    int code;
    GError *error = NULL;

    gchar *script;
    gsize script_len;

    if (!g_file_get_contents(program_name, &script, &script_len, &error))
        g_critical("%s\n", error->message);

    /* evaluate the script */
    if (!gjs_context_eval(self->gjs, script, script_len, program_name, &code, &error))
    {
        if (!g_error_matches(error, GJS_ERROR, GJS_ERROR_SYSTEM_EXIT))
            g_critical("%s", error->message);
        g_clear_error(&error);
    }
}

/**
 * avro_suggester_get_pref_dict:
 * Returns: a #gboolean preference dictionary suggestion
 */
gboolean avro_suggester_get_pref_dict(AvroSuggester *self)
{
    return true;
}

/**
 * avro_suggester_set_pref_dict:
 * @enabled: (in): preference set enable/disable dictionary suggestion
 */
void avro_suggester_set_pref_dict(AvroSuggester *self, gboolean enabled)
{
}

/**
 * avro_suggester_suggest:
 * @text: (in): user typed text
 * @words: (out)(element-type utf8): suggestion list
 * @prev_selection: (out): prev selection index
 */
void avro_suggester_suggest(AvroSuggester *self, gchar *text, GList *words, gint *prev_selection)
{
}

/**
 * avro_suggester_commit_string:
 * @text: (in): user typed text
 * @word: (in): user selected candidate to commit
 */
void avro_suggester_commit_string(AvroSuggester *self, gchar *text, gchar *word)
{
}

/**
 * avro_suggester_update_candidate:
 * @text: (in): user typed text
 * @word: (in): user selected candidate to update
 */
void avro_suggester_update_candidate(AvroSuggester *self, gchar *text, gchar *word)
{
}
