---
layout: default
title: Installing ibus-avro on Ubuntu 12.04
---

###Installing ibus-avro on Ubuntu 12.04

Open **Terminal** and enter the following commands one by one.

Step 1: Add ibus-avro repository

	sudo add-apt-repository "deb http://download.opensuse.org/repositories/home:/sarimkhan/xUbuntu_12.04/ ./"


Step 2: Add key

	wget -q http://download.opensuse.org/repositories/home:/sarimkhan/xUbuntu_12.04/Release.key -O- | sudo apt-key add -


Step 3: Update package list

	sudo apt-get update


Step 4: Install ibus-avro

	sudo apt-get install ibus-avro



###Using ibus-avro
 1. Run __IBus__ (`Applications -> System Tools -> IBus`) from _Dash_
 2. Open __IBus__ `Preferences` from the top panel icon  
 3. Go to `Input method`
 4. `Select an input method -> Bengali -> Avro`
 5. Now Click `Add` button to add __Avro__ to the list
 6. Now restart __IBus__ from the top panel icon (`Right Click -> Restart`)
 7. Now Press `Ctrl+Space` to toggle between _English_ and _Avro_ (Bengali)
 8. Enjoy __Avro Phonetic!__

###Setting IBus as default input method

You may want to set IBus as your default input method so that it starts automatically every time you log in.

1. Run __Input Method Switcher__ (`im-switch`) from *Dash*
2. Select __IBus__
3. Log out and log in again.

	
###Uninstalling ibus-avro

Step 1: Open **Terminal** and enter the following command:

	sudo apt-get remove ibus-avro
	
Step 2: Restart IBus.
