#include <stdlib.h> // for exit
#include <string.h> // for strcmp, strlen

#include <unistd.h> // for close

#include <gio/gio.h>
#include <glib-object.h>
#include <glib.h>

#include <gjs/gjs.h>
#include "gjs/context-private.h"

#include <jsapi.h>

int define_argv_and_eval_script(GjsContext *gjs_context, int argc,
                                const char **argv, const char *script,
                                size_t len, const char *filename)
{
    GError *error = NULL;

    /* prepare command line arguments */
    if (!gjs_context_define_string_array(
            gjs_context, "ARGV", argc, argv, &error))
    {
        g_critical("Failed to define ARGV: %s", error->message);
        g_clear_error(&error);
        return 1;
    }

    /* evaluate the script */
    int code;
    if (!gjs_context_eval(gjs_context, script, len, filename, &code, &error))
    {
        if (!g_error_matches(error, GJS_ERROR, GJS_ERROR_SYSTEM_EXIT))
            g_critical("%s", error->message);
        g_clear_error(&error);
    }
    return code;
}

bool magic_native_function(JSContext* cx, unsigned argc, JS::Value* vp) {
    g_print("magic call from js land wow\n");

    return true;
}

int define_native_function(GjsContext *gjs_context)
{
    // JSContext *ctx = (JSContext *) gjs_context_get_native_context(gjs_context);
    GjsContextPrivate* gjs = GjsContextPrivate::from_object(gjs_context);

    JSAutoRealm ar(gjs->context(), gjs->global());

    JS::RootedObject global_root(gjs->context(), gjs->global());

    // JSObject *js_global = JS::CurrentGlobalOrNull(ctx);
    // g_assert(js_global != nullptr);
    
    g_print("got global obj\n");

    JSFunction *func = JS_DefineFunction(gjs->context(), global_root, "GITTU_DEF", magic_native_function, 2, JSPROP_READONLY | JSPROP_PERMANENT);

    g_print("func hook\n");

    return func == NULL;
}

int main(int argc, char **argv)
{
    GError *error = nullptr;
    GjsContext *gjs_context;
    char *script;
    const char *filename;
    const char *program_name;
    gsize len;


    g_assert(argc >= 2);
    error = nullptr;
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

    if (define_native_function(gjs_context)) {
        g_print("successful function hook\n");
    }

    int code = define_argv_and_eval_script(gjs_context, gjs_argc, gjs_argv,
                                           script, len, filename);

    g_object_unref(gjs_context);
    g_free(script);

    exit(code);
}
