#ifndef SUGGESTION_BUILDER_H_ // beginning
#define SUGGESTION_BUILDER_H_

#include <gio/gio.h>
#include <glib-object.h>
#include <glib.h>

#include <gjs/gjs.h>

G_BEGIN_DECLS

#define AVRO_TYPE_SUGGESTER (suggester_get_type())

G_DECLARE_FINAL_TYPE(Suggester, suggester, AVRO, SUGGESTER, GObject)

gboolean suggester_get_pref_dict(Suggester *self);
void suggester_set_pref_dict(Suggester *self, gboolean enabled);
void suggester_suggest(Suggester *self, gchar *text, GList *words, gint *prev_selection);
void suggester_commit_string(Suggester *self, gchar *text, gchar *word);
void suggester_update_candidate(Suggester *self, gchar *text, gchar *word);

G_END_DECLS

#endif // SUGGESTION_BUILDER_H_ // end