project('gbridge', 'c', 'cpp',
    default_options : [
        'c_std=gnu99',
        'cpp_std=gnu++11'
    ]
)

gnome = import('gnome')

gdeps = [
    dependency('glib-2.0'),
    dependency('gjs-1.0'),
    dependency('mozjs-68')
]

sources = files('test-suggester.c', 'suggester.cpp')

avrolib = shared_library('avro',
                        sources,
                        dependencies : gdeps,
                        install : true)

avro_gir = gnome.generate_gir(
  avrolib,
  sources: ['suggester.cpp', 'suggester.h'],
  namespace: 'Avro',
  nsversion: '0.1',
  dependencies: gdeps,
  install: true
)

executable('gbridge', sources, dependencies : gdeps, link_with : avrolib)