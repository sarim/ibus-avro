#include "suggester.h"

struct _Suggester
{
    GObject parent_instance;

    GjsContext *gjs;
};

G_DEFINE_TYPE(Suggester, suggester, G_TYPE_OBJECT)

/* class initializer, called only once */
static void
suggester_class_init(SuggesterClass *klass)
{
}

/* instance initializer */
static void
suggester_init(Suggester *self)
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
 * suggester_get_pref_dict:
 * Returns: a #gboolean preference dictionary suggestion
 */
gboolean suggester_get_pref_dict(Suggester *self)
{
    return true;
}

/**
 * suggester_set_pref_dict:
 * @enabled: (in): preference set enable/disable dictionary suggestion
 */
void suggester_set_pref_dict(Suggester *self, gboolean enabled)
{
}

/**
 * suggester_suggest:
 * @text: (in): user typed text
 * @words: (out): suggestion list
 * @prev_selection: (out): prev selection index
 */
void suggester_suggest(Suggester *self, gchar *text, GList *words, gint *prev_selection)
{
}

/**
 * suggester_commit_string:
 * @text: (in): user typed text
 * @word: (in): user selected candidate to commit
 */
void suggester_commit_string(Suggester *self, gchar *text, gchar *word)
{
}

/**
 * suggester_update_candidate:
 * @text: (in): user typed text
 * @word: (in): user selected candidate to update
 */
void suggester_update_candidate(Suggester *self, gchar *text, gchar *word)
{
}
