project('gbridge', 'c', 'cpp')

gdeps = [
    dependency('glib-2.0'),
    dependency('gjs-1.0'),
    dependency('mozjs-68')
]

inc = include_directories('gjs', 'gjs/build')
sources = files('main.cpp', 'fake-context.cpp')

executable('gbridge', sources, include_directories : inc, dependencies : gdeps)