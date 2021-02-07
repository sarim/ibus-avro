#ifndef SUGGESTION_BUILDER_H_ // beginning
#define SUGGESTION_BUILDER_H_

#include <gio/gio.h>
#include <glib-object.h>
#include <glib.h>

#include <gjs/gjs.h>

G_BEGIN_DECLS

#define AVRO_TYPE_SUGGESTER (avro_suggester_get_type())

G_DECLARE_FINAL_TYPE(AvroSuggester, avro_suggester, AVRO, SUGGESTER, GObject)

gboolean avro_suggester_get_pref_dict(AvroSuggester *self);
void avro_suggester_set_pref_dict(AvroSuggester *self, gboolean enabled);
void avro_suggester_suggest(AvroSuggester *self, gchar *text, GList *words, gint *prev_selection);
void avro_suggester_commit_string(AvroSuggester *self, gchar *text, gchar *word);
void avro_suggester_update_candidate(AvroSuggester *self, gchar *text, gchar *word);

G_END_DECLS

#endif // SUGGESTION_BUILDER_H_ // end