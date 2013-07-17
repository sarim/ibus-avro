/* vim:set et sts=4: */


#ifndef __ENGINE_H__
#define __ENGINE_H__

#include <ibus.h>

#define IBUS_TYPE_AVRO_ENGINE	\
	(ibus_avro_engine_get_type ())

GType   ibus_avro_engine_get_type    (void);

#endif

