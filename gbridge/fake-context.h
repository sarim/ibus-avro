#include <config.h>

#include <signal.h>  // for sigaction, SIGUSR1, sa_handler
#include <stdint.h>
#include <stdio.h>      // for FILE, fclose, size_t
#include <string.h>     // for memset
#include <sys/types.h>  // IWYU pragma: keep

#ifdef HAVE_UNISTD_H
#    include <unistd.h>  // for getpid
#elif defined (_WIN32)
#    include <process.h>
#endif

#include <new>
#include <string>  // for u16string
#include <unordered_map>
#include <utility>  // for move

#define INSIDE_GJS_H
#define GJS_COMPILATION

#include <gio/gio.h>
#include <girepository.h>
#include <glib-object.h>
#include <glib.h>

#include "gi/object.h"
#include "gi/private.h"
#include "gi/repo.h"
#include "gjs/atoms.h"
#include "gjs/byteArray.h"
#include "gjs/context-private.h"
#include "gjs/context.h"
#include "gjs/engine.h"
#include "gjs/error-types.h"
#include "gjs/global.h"
#include "gjs/importer.h"
#include "gjs/jsapi-util.h"
#include "gjs/mem.h"
#include "gjs/native.h"
#include "gjs/profiler-private.h"
#include "gjs/profiler.h"