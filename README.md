# Avro phonetic for Linux in IBus
Avro phonetic implementation for Linux in IBus.

Now in early stage of development, but its pretty usable.

## Installation

1. Open terminal/package manager and install following packages:
 
		git 
		libibus-1.0-dev
		automake 
		autoconf
		gjs
		gir1.2-gjsdbus-1.0
		gir1.2-ibus-1.0

    __For Ubuntu 12.04__
    
    	sudo apt-get install git libibus-1.0-dev automake autoconf gjs gir1.2-gjsdbus-1.0 gir1.2-ibus-1.0
	
	
    __For other linux distributions (Gnome 3 only)__
    
    You'll need all related build tools like `automake`, `autoconf` etc...
    and Latest __IBus__ from _git_ compiled with _gobject-introspection_ support enabled.

2. Now give the following commands step-by-step:

		git clone git://github.com/sarim/ibus-avro.git
		cd ibus-avro
		aclocal && autoconf && automake --add-missing
		./configure --prefix=/usr
		sudo make install


## Usage
 1. Run __IBus__ (`Applications -> System Tools -> IBus`) from _Dash_
 2. Open __IBus__ `Preferences` from the top panel icon  
 3. Go to `Input method`
 4. `Select an input method -> Bengali -> Avro`
 5. Now Click `Add` button to add __Avro__ to the list
 6. Now restart __IBus__ from the top panel icon (`Right Click -> Restart`)
 7. Now Press `Ctrl+Space` to toggle between _English_ and _Avro_ (Bengali)
 8. Enjoy __Avro Phonetic!__


## Contributors
 
__IBus Engine__ by __Sarim Khan__ <sarim2005@gmail.com>

[__Avro JavaScript Phonetic Library__](https://github.com/torifat/jsAvroPhonetic) by [__Rifat Nabi__](https://github.com/torifat)

__Avro Phonetic Dictionary Search Library__ by [__Mehdi Hasan Khan__](https://github.com/omicronlab)

_Licensed under Mozilla Public License 1.1 ("MPL"), an open source/free software license._