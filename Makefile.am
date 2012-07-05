AUTOMAKE_OPTIONS = foreign

ibus-avro.xml: ibus-avro.xml.in
	$(AM_V_GEN) \
	( \
		libexecdir=${libexecdir}; \
		pkgdatadir=${pkgdatadir}; \
		s=`cat $<`; \
		eval "echo \"$${s}\""; \
	) > $@
	
	
evars.js: evars.js.in
	$(AM_V_GEN) \
	( \
		libexecdir=${libexecdir}; \
		pkgdatadir=${pkgdatadir}; \
		s=`cat $<`; \
		eval "echo \"$${s}\""; \
	) > $@
	
install: ibusavro evars.js ibus-avro.xml main-gjs.js avrolib.js utf8.js avro-bangla.png
	mkdir -p $(pkgdatadir)/
	mkdir -p $(libexecdir)/
	${INSTALL} -m 644 evars.js ${pkgdatadir}/evars.js
	${INSTALL} -m 755 main-gjs.js ${pkgdatadir}/main-gjs.js	
	${INSTALL} -m 644 avrolib.js ${pkgdatadir}/avrolib.js
	${INSTALL} -m 644 utf8.js ${pkgdatadir}/utf8.js
	${INSTALL} -m 644 database.js ${pkgdatadir}/database.js
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
	
	
clean:
	rm ibusavro evars.js ibus-avro.xml Makefile
