#include "fake-context.h"

static void     gjs_context_dispose           (GObject               *object);
static void     gjs_context_finalize          (GObject               *object);
static void     gjs_context_constructed       (GObject               *object);
static void     gjs_context_get_property      (GObject               *object,
                                                  guint                  prop_id,
                                                  GValue                *value,
                                                  GParamSpec            *pspec);
static void     gjs_context_set_property      (GObject               *object,
                                                  guint                  prop_id,
                                                  const GValue          *value,
                                                  GParamSpec            *pspec);

struct _GjsContext {
    GObject parent;
};

struct _GjsContextClass {
    GObjectClass parent;
};

#if __GNUC__ >= 8
_Pragma("GCC diagnostic push")
_Pragma("GCC diagnostic ignored \"-Wcast-function-type\"")
#endif
G_DEFINE_TYPE_WITH_PRIVATE(GjsContext, gjs_context, G_TYPE_OBJECT);
#if __GNUC__ >= 8
_Pragma("GCC diagnostic pop")
#endif