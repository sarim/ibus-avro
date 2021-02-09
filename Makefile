BINARY_NAME=ibus-engine-avro-beta
BINARY_PREF_UI=prefui/build/ibus-setup-avro-beta

all: build buildpref

build: $(BINARY_NAME)

$(BINARY_NAME): $(wildcard *.go)
		GOOS=linux GOARCH=amd64 go build -o $(BINARY_NAME) -v

$(BINARY_PREF_UI):
	cd prefui; meson --prefix=${prefix} build
	cd prefui/build; ninja

buildpref: $(BINARY_PREF_UI)

install: build buildpref
	mkdir -p ${prefix}/lib/ibus
	mkdir -p $(prefix)/share/ibus/component
	mkdir -p ${prefix}/share/ibus-avro-beta
	cp $(BINARY_NAME) ${prefix}/lib/ibus/$(BINARY_NAME)
	chmod +x ${prefix}/lib/ibus/$(BINARY_NAME)
	cp prefui/ui/avro-bangla.png ${prefix}/share/ibus-avro-beta/
	${prefix}/lib/ibus/$(BINARY_NAME) -prefix $(prefix) -xml $(prefix)/share/ibus/component/ibus-avro-beta.xml
	cd prefui/build; ninja install
clean:
		go clean
		rm -f $(BINARY_NAME)

PHONY: all build clean