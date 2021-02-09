project('avro setup', 'vala', 'c')

gnome = import('gnome')

dependencies = [
    dependency('glib-2.0'),
    dependency('gobject-2.0'),
    dependency('gtk+-3.0'),
]

sources = files('gmain.vala')

install_data(
    'gschema.xml',
    install_dir: join_paths(get_option('datadir'), 'glib-2.0', 'schemas'),
    rename: 'com.omicronlab.avrobeta.gschema.xml'
)
meson.add_install_script('meson_post_install.py')

gresources = gnome.compile_resources(
    'pref-resources',
    'ui/gresources.xml',
    source_dir: ['ui']
)

executable('ibus-setup-avro-beta', sources, gresources, dependencies: dependencies, install : true, install_dir : 'lib/ibus')