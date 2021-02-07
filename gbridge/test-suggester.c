#include <locale.h>  // for setlocale, LC_ALL

#include "suggester.h"

#include <glib/gstdio.h>

int main(int argc, char **argv)
{
    setlocale(LC_CTYPE, "");

    if (argc > 1)
        g_chdir(argv[1]);

    AvroSuggester *suggester = (AvroSuggester *)g_object_new(AVRO_TYPE_SUGGESTER, NULL);

    g_object_unref(suggester);
}