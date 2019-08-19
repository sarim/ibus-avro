AUTOMAKE_OPTIONS = foreign
FILES = autocorrect.js avro-bangla.png avrodict.js avrolib.js avropref.ui avroregexlib.js changeloggen.sh com.omicronlab.avro.gschema.xml configure.ac database-compiler.js Database.db3 dbsearch.js evars.js.in ibus-avro.xml.in ibus-setup-ibus-avro.desktop.in levenshtein.js main-gjs.js Makefile.am pref.js README.md suffixdict.js suggestionbuilder.js utf8.js

all: build
	@:
	
build: evars.js ibus-avro.xml ibus-setup-ibus-avro.desktop main-gjs.js avrolib.js utf8.js avro-bangla.png avrodict.js suffixdict.js dbsearch.js avroregexlib.js suggestionbuilder.js levenshtein.js autocorrect.js
	@:

%: %.in ibus-avro.xml.in evars.js.in evars.js.in ibus-setup-ibus-avro.desktop.in
	$(AM_V_GEN) \
	( \
		libexecdir=${libexecdir}; \
		pkgdatadir=${pkgdatadir}; \
		s=`cat $<`; \
		eval "echo \"$${s}\""; \
	) > $@

install: all
	mkdir -p $(pkgdatadir)/
	mkdir -p $(libexecdir)/
	mkdir -p ${pkgdatadir}/../glib-2.0/schemas/
	mkdir -p ${pkgdatadir}/../ibus/component/
	mkdir -p ${pkgdatadir}/../applications/
	${INSTALL} -m 644 evars.js ${pkgdatadir}/evars.js
	${INSTALL} -m 755 main-gjs.js ${pkgdatadir}/main-gjs.js	
	${INSTALL} -m 644 avrolib.js ${pkgdatadir}/avrolib.js
	${INSTALL} -m 644 utf8.js ${pkgdatadir}/utf8.js
	${INSTALL} -m 644 avrodict.js ${pkgdatadir}/avrodict.js
	${INSTALL} -m 644 suffixdict.js ${pkgdatadir}/suffixdict.js
	${INSTALL} -m 644 dbsearch.js ${pkgdatadir}/dbsearch.js
	${INSTALL} -m 644 avroregexlib.js ${pkgdatadir}/avroregexlib.js
	${INSTALL} -m 644 suggestionbuilder.js ${pkgdatadir}/suggestionbuilder.js
	${INSTALL} -m 644 levenshtein.js ${pkgdatadir}/levenshtein.js
	${INSTALL} -m 644 autocorrect.js ${pkgdatadir}/autocorrect.js
	${INSTALL} -m 755 pref.js ${pkgdatadir}/pref.js	
	${INSTALL} -m 644 avropref.ui ${pkgdatadir}/avropref.ui	
	${INSTALL} -m 644 avro-bangla.png ${pkgdatadir}/avro-bangla.png
	${INSTALL} -m 644 ibus-avro.xml ${pkgdatadir}/../ibus/component/ibus-avro.xml
	${INSTALL} -m 644 com.omicronlab.avro.gschema.xml ${pkgdatadir}/../glib-2.0/schemas/com.omicronlab.avro.gschema.xml
	glib-compile-schemas ${pkgdatadir}/../glib-2.0/schemas/
	${INSTALL} -m 644 ibus-setup-ibus-avro.desktop ${pkgdatadir}/../applications/ibus-setup-ibus-avro.desktop

installdeb: all
	mkdir -p $(DESTDIR)$(pkgdatadir)/
	mkdir -p $(DESTDIR)$(libexecdir)/
	mkdir -p $(DESTDIR)${pkgdatadir}/../glib-2.0/schemas/
	mkdir -p $(DESTDIR)${pkgdatadir}/../ibus/component/	
	mkdir -p $(DESTDIR)${pkgdatadir}/../metainfo/
	mkdir -p $(DESTDIR)${pkgdatadir}/../applications/
	${INSTALL} -m 644 evars.js $(DESTDIR)${pkgdatadir}/evars.js
	${INSTALL} -m 755 main-gjs.js $(DESTDIR)${pkgdatadir}/main-gjs.js	
	${INSTALL} -m 644 avrolib.js $(DESTDIR)${pkgdatadir}/avrolib.js
	${INSTALL} -m 644 utf8.js $(DESTDIR)${pkgdatadir}/utf8.js
	${INSTALL} -m 644 avrodict.js $(DESTDIR)${pkgdatadir}/avrodict.js
	${INSTALL} -m 644 suffixdict.js $(DESTDIR)${pkgdatadir}/suffixdict.js
	${INSTALL} -m 644 dbsearch.js $(DESTDIR)${pkgdatadir}/dbsearch.js
	${INSTALL} -m 644 avroregexlib.js $(DESTDIR)${pkgdatadir}/avroregexlib.js
	${INSTALL} -m 644 suggestionbuilder.js $(DESTDIR)${pkgdatadir}/suggestionbuilder.js
	${INSTALL} -m 644 levenshtein.js $(DESTDIR)${pkgdatadir}/levenshtein.js
	${INSTALL} -m 644 autocorrect.js $(DESTDIR)${pkgdatadir}/autocorrect.js
	${INSTALL} -m 755 pref.js $(DESTDIR)${pkgdatadir}/pref.js	
	${INSTALL} -m 644 avropref.ui $(DESTDIR)${pkgdatadir}/avropref.ui	
	${INSTALL} -m 644 avro-bangla.png $(DESTDIR)${pkgdatadir}/avro-bangla.png
	${INSTALL} -m 644 ibus-avro.xml $(DESTDIR)${pkgdatadir}/../ibus/component/ibus-avro.xml
	${INSTALL} -m 644 com.omicronlab.avro.gschema.xml $(DESTDIR)${pkgdatadir}/../glib-2.0/schemas/com.omicronlab.avro.gschema.xml
	${INSTALL} -m 644 com.github.sarim.ibus.avro.metainfo.xml $(DESTDIR)${pkgdatadir}/../metainfo/com.github.sarim.ibus.avro.metainfo.xml
	${INSTALL} -m 644 ibus-setup-ibus-avro.desktop $(DESTDIR)${pkgdatadir}/../applications/ibus-setup-ibus-avro.desktop

uninstall: 
	rm ${pkgdatadir}/../ibus/component/ibus-avro.xml
	rm ${pkgdatadir}/../glib-2.0/schemas/com.omicronlab.avro.gschema.xml
	rm ${pkgdatadir}/../applications/ibus-setup-ibus-avro.desktop
	glib-compile-schemas ${pkgdatadir}/../glib-2.0/schemas/
	rm -rf ${pkgdatadir}

clean:
	@:
cleanup:
	rm -r evars.js ibus-avro.xml ibus-setup-ibus-avro.desktop Makefile autom4te.cache/ aclocal.m4 config.log config.status configure Makefile.in install-sh missing
.PHONY: all build clean
