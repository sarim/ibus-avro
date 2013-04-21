/* vim:set et sts=4: */
#include "engine.h"
#include <skv8.h>

typedef struct _IBusEnchantEngine IBusEnchantEngine;
typedef struct _IBusEnchantEngineClass IBusEnchantEngineClass;

struct _IBusEnchantEngine {
	IBusEngine parent;

    /* members */
    GString *preedit;
    gint cursor_pos;

    IBusLookupTable *table;
};

struct _IBusEnchantEngineClass {
	IBusEngineClass parent;
};

/* functions prototype */
static void	ibus_enchant_engine_class_init	(IBusEnchantEngineClass	*klass);
static void	ibus_enchant_engine_init		(IBusEnchantEngine		*engine);
static void	ibus_enchant_engine_destroy		(IBusEnchantEngine		*engine);
static gboolean 
			ibus_enchant_engine_process_key_event
                                            (IBusEngine             *engine,
                                             guint               	 keyval,
                                             guint               	 keycode,
                                             guint               	 modifiers);
static void ibus_enchant_engine_focus_in    (IBusEngine             *engine);
static void ibus_enchant_engine_focus_out   (IBusEngine             *engine);
static void ibus_enchant_engine_reset       (IBusEngine             *engine);
static void ibus_enchant_engine_enable      (IBusEngine             *engine);
static void ibus_enchant_engine_disable     (IBusEngine             *engine);
static void ibus_engine_set_cursor_location (IBusEngine             *engine,
                                             gint                    x,
                                             gint                    y,
                                             gint                    w,
                                             gint                    h);
static void ibus_enchant_engine_set_capabilities
                                            (IBusEngine             *engine,
                                             guint                   caps);
static void ibus_enchant_engine_page_up     (IBusEngine             *engine);
static void ibus_enchant_engine_page_down   (IBusEngine             *engine);
static void ibus_enchant_engine_cursor_up   (IBusEngine             *engine);
static void ibus_enchant_engine_cursor_down (IBusEngine             *engine);
static void ibus_enchant_property_activate  (IBusEngine             *engine,
                                             const gchar            *prop_name,
                                             gint                    prop_state);
static void ibus_enchant_engine_property_show
											(IBusEngine             *engine,
                                             const gchar            *prop_name);
static void ibus_enchant_engine_property_hide
											(IBusEngine             *engine,
                                             const gchar            *prop_name);

static void ibus_enchant_engine_commit_string
                                            (IBusEnchantEngine      *enchant,
                                             const gchar            *string);
static void ibus_enchant_engine_update      (IBusEnchantEngine      *enchant);


G_DEFINE_TYPE (IBusEnchantEngine, ibus_enchant_engine, IBUS_TYPE_ENGINE)

static void
ibus_enchant_engine_class_init (IBusEnchantEngineClass *klass)
{
	IBusObjectClass *ibus_object_class = IBUS_OBJECT_CLASS (klass);
	IBusEngineClass *engine_class = IBUS_ENGINE_CLASS (klass);
	
	ibus_object_class->destroy = (IBusObjectDestroyFunc) ibus_enchant_engine_destroy;

    engine_class->process_key_event = ibus_enchant_engine_process_key_event;
}

static void
ibus_enchant_engine_init (IBusEnchantEngine *enchant)
{
    loadjs();
    enchant->preedit = g_string_new ("");
    enchant->cursor_pos = 0;

    enchant->table = ibus_lookup_table_new (9, 0, TRUE, TRUE);
    g_object_ref_sink (enchant->table);
}

static void
ibus_enchant_engine_destroy (IBusEnchantEngine *enchant)
{
    if (enchant->preedit) {
        g_string_free (enchant->preedit, TRUE);
        enchant->preedit = NULL;
    }

    if (enchant->table) {
        g_object_unref (enchant->table);
        enchant->table = NULL;
    }

	((IBusObjectClass *) ibus_enchant_engine_parent_class)->destroy ((IBusObject *)enchant);
}

static void
ibus_enchant_engine_update_lookup_table (IBusEnchantEngine *enchant)
{
    gchar ** sugs;
    gint n_sug, i;
    gboolean retval;

    //gchar *sk[2] = {"sarim","khan"};



    
    if (enchant->preedit->len == 0) {
        ibus_engine_hide_lookup_table ((IBusEngine *) enchant);
       return;
    }

    ibus_lookup_table_clear (enchant->table);

    std::vector<std::string> suggts = recvlists( enchant->preedit->str);
    n_sug = suggts.size();

    //char ** bnsugs = recvlists(enchant->preedit->str,&n_sug);
    //sugs = (gchar **)bnsugs;
    /*sugs = enchant_dict_suggest (dict,
                                 enchant->preedit->str,
                                 enchant->preedit->len,
                                 &n_sug);
                                 */


    if (/*sugs == NULL ||*/ n_sug == 0) {
        ibus_engine_hide_lookup_table ((IBusEngine *) enchant);
        return;
    }


    for (i = 0; i < n_sug; i++) {
        ibus_lookup_table_append_candidate (enchant->table, ibus_text_new_from_string (suggts[i].c_str()));
    }



    ibus_engine_update_lookup_table ((IBusEngine *) enchant, enchant->table, TRUE);

    //if (sugs)
    //    enchant_dict_free_suggestions (dict, sugs);
}

static void
ibus_enchant_engine_update_preedit (IBusEnchantEngine *enchant)
{
    IBusText *text;
    gint retval;

    text = ibus_text_new_from_static_string (enchant->preedit->str);
    text->attrs = ibus_attr_list_new ();
    
    ibus_attr_list_append (text->attrs,
                           ibus_attr_underline_new (IBUS_ATTR_UNDERLINE_SINGLE, 0, enchant->preedit->len));

/*
    if (enchant->preedit->len > 0) {
        retval = enchant_dict_check (dict, enchant->preedit->str, enchant->preedit->len);
        if (retval != 0) {
            ibus_attr_list_append (text->attrs,
                               ibus_attr_foreground_new (0xff0000, 0, enchant->preedit->len));
        }
    }
 */   
    ibus_engine_update_preedit_text ((IBusEngine *)enchant,
                                     text,
                                     enchant->cursor_pos,
                                     TRUE);

}

/* commit preedit to client and update preedit */
static gboolean
ibus_enchant_engine_commit_preedit (IBusEnchantEngine *enchant)
{
    if (enchant->preedit->len == 0)
        return FALSE;
    
    ibus_enchant_engine_commit_string (enchant, enchant->preedit->str);
    g_string_assign (enchant->preedit, "");
    enchant->cursor_pos = 0;

    ibus_enchant_engine_update (enchant);

    return TRUE;
}


static void
ibus_enchant_engine_commit_string (IBusEnchantEngine *enchant,
                                   const gchar       *string)
{
    IBusText *text;
    text = ibus_text_new_from_static_string (string);
    ibus_engine_commit_text ((IBusEngine *)enchant, text);
}

static void
ibus_enchant_engine_update (IBusEnchantEngine *enchant)
{
    ibus_enchant_engine_update_preedit (enchant);
    ibus_engine_hide_lookup_table ((IBusEngine *)enchant);
}

#define is_alpha(c) (((c) >= IBUS_a && (c) <= IBUS_z) || ((c) >= IBUS_A && (c) <= IBUS_Z))

static gboolean 
ibus_enchant_engine_process_key_event (IBusEngine *engine,
                                       guint       keyval,
                                       guint       keycode,
                                       guint       modifiers)
{
    IBusText *text;
    IBusEnchantEngine *enchant = (IBusEnchantEngine *)engine;

    if (modifiers & IBUS_RELEASE_MASK)
        return FALSE;

    modifiers &= (IBUS_CONTROL_MASK | IBUS_MOD1_MASK);

    //if (modifiers == IBUS_CONTROL_MASK && keyval == IBUS_s) {
    //    ibus_enchant_engine_update_lookup_table (enchant);
    //    return TRUE;
    //}

    if (modifiers != 0) {
        if (enchant->preedit->len == 0)
            return FALSE;
        else
            return TRUE;
    }


    switch (keyval) {
    case IBUS_space:
        g_string_append (enchant->preedit, " ");
        return ibus_enchant_engine_commit_preedit (enchant);
    case IBUS_Return:
        return ibus_enchant_engine_commit_preedit (enchant);

    case IBUS_Escape:
        if (enchant->preedit->len == 0)
            return FALSE;

        g_string_assign (enchant->preedit, "");
        enchant->cursor_pos = 0;
        ibus_enchant_engine_update (enchant);
        return TRUE;        

    case IBUS_Left:
        if (enchant->preedit->len == 0)
            return FALSE;
        if (enchant->cursor_pos > 0) {
            enchant->cursor_pos --;
            ibus_enchant_engine_update (enchant);
        }
        return TRUE;

    case IBUS_Right:
        if (enchant->preedit->len == 0)
            return FALSE;
        if (enchant->cursor_pos < enchant->preedit->len) {
            enchant->cursor_pos ++;
            ibus_enchant_engine_update (enchant);
        }
        return TRUE;
    
    case IBUS_Up:
        if (enchant->preedit->len == 0)
            return FALSE;
        if (enchant->cursor_pos != 0) {
            enchant->cursor_pos = 0;
            ibus_enchant_engine_update (enchant);
        }
        return TRUE;

    case IBUS_Down:
        if (enchant->preedit->len == 0)
            return FALSE;
        
        if (enchant->cursor_pos != enchant->preedit->len) {
            enchant->cursor_pos = enchant->preedit->len;
            ibus_enchant_engine_update (enchant);
        }
        
        return TRUE;
    
    case IBUS_BackSpace:
        if (enchant->preedit->len == 0)
            return FALSE;
        if (enchant->cursor_pos > 0) {
            enchant->cursor_pos --;
            g_string_erase (enchant->preedit, enchant->cursor_pos, 1);
            ibus_enchant_engine_update (enchant);
        }
        return TRUE;
    
    case IBUS_Delete:
        if (enchant->preedit->len == 0)
            return FALSE;
        if (enchant->cursor_pos < enchant->preedit->len) {
            g_string_erase (enchant->preedit, enchant->cursor_pos, 1);
            ibus_enchant_engine_update (enchant);
        }
        return TRUE;
    }

    if (is_alpha (keyval)) {
        g_string_insert_c (enchant->preedit,
                           enchant->cursor_pos,
                           keyval);

        enchant->cursor_pos ++;
        ibus_enchant_engine_update (enchant);
        ibus_enchant_engine_update_lookup_table (enchant);
        return TRUE;
    }

    return FALSE;
}

