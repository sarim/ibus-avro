#include <stdlib.h> // for exit
#include <string.h> // for strcmp, strlen

#include <unistd.h> // for close

#include <gio/gio.h>
#include <glib-object.h>
#include <glib.h>

#include <gjs/gjs.h>

int define_argv_and_eval_script(GjsContext *js_context, int argc,
                                const char **argv, const char *script,
                                size_t len, const char *filename)
{
    GError *error = NULL;

    /* prepare command line arguments */
    if (!gjs_context_define_string_array(
            js_context, "ARGV", argc, argv, &error))
    {
        g_critical("Failed to define ARGV: %s", error->message);
        g_clear_error(&error);
        return 1;
    }

    /* evaluate the script */
    int code;
    if (!gjs_context_eval(js_context, script, len, filename, &code, &error))
    {
        if (!g_error_matches(error, GJS_ERROR, GJS_ERROR_SYSTEM_EXIT))
            g_critical("%s", error->message);
        g_clear_error(&error);
    }
    return code;
}

int main(int argc, char **argv)
{
    GError *error = NULL;
    GjsContext *gjs_context;
    char *script;
    const char *filename;
    const char *program_name;
    gsize len;


    g_assert(argc >= 2);
    error = NULL;
    if (!g_file_get_contents(argv[1], &script, &len, &error))
    {
        g_printerr("%s\n", error->message);
        exit(1);
    }

    const char **gjs_argv = (const char **) &argv[2];
    int gjs_argc = argc - 2;

    filename = argv[1];
    program_name = argv[1];

    gjs_context = (GjsContext *)g_object_new(GJS_TYPE_CONTEXT,
                                            "search-path", NULL,
                                            "program-name", program_name,
                                            "profiler-enabled", false,
                                            NULL);

    int code = define_argv_and_eval_script(gjs_context, gjs_argc, gjs_argv,
                                           script, len, filename);

    g_object_unref(gjs_context);
    g_free(script);

    exit(code);
}
