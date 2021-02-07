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

executable('gbridge', sources, dependencies : gdeps)