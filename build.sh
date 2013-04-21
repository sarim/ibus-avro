AVROV8_DIR=./avrov8/
V8_INCLUDE_DIR=./v8-3.18.1/include/
V8_LIB_DIR=./libs/

clang++ -Wl,-R$V8_LIB_DIR -DHAVE_CONFIG_H -I. -I $V8_INCLUDE_DIR -I $AVROV8_DIR -I/usr/include/ibus-1.0 -I/usr/include/glib-2.0 -I/usr/lib/glib-2.0/include -pthread -I/usr/include/glib-2.0 -I/usr/lib/glib-2.0/include -DPKGDATADIR=\"`pwd`\" -libus-1.0  -lgio-2.0 -lgobject-2.0 -lglib-2.0 -pthread -lgmodule-2.0 -lglib-2.0 -L $V8_LIB_DIR -lskv8 -g -O2 engine.cpp main.cpp -o ibus-avro
