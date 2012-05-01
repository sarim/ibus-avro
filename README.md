# Avro phonetic in ibus
Avro phonetic implementation in ibus.
Now in early stage of development, but its pretty usable.
You need to have latest ibus from git compiled with gobject-introspection support enabled.

Install

	git clone git://github.com/sarim/ibus-avro.git
	cd ibus-avro
	aclocal && autoconf && automake
	./configure --prefix=/usr
	sudo make install

To test the avro-phonetic engine, Goto ibus preferences and add Bengali > Avro then hit cntrl+space to start writing.
