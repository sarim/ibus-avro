project('prefui', 'vala', 'c')

dependencies = [
    dependency('glib-2.0'),
    dependency('gobject-2.0'),
    dependency('gtk+-3.0'),
]

sources = files('gmain.vala')

install_data(
    'gschema.xml',
    install_dir: get_option('datadir') / 'glib-2.0' / 'schemas',
    rename: 'com.omicronlab.avro.gschema.xml'
)
meson.add_install_script('meson_post_install.py')

executable('ibus-avro-pref', sources, dependencies: dependencies)