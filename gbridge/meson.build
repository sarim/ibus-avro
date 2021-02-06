project('gbridge', 'c', 'cpp')

gdeps = [
    dependency('glib-2.0'),
    dependency('gjs-1.0'),
    dependency('mozjs-68')
]

sources = files('main.cpp')

executable('gbridge', sources, dependencies : gdeps)