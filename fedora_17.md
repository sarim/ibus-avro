---
layout: default
title: Installing ibus-avro on Fedora 17
---

###Installing ibus-avro on Fedora 17

Open **Terminal** and enter the following commands one by one.

Step 1: Become root

	sudo -s
or
	su 
	
Step 2: Add ibus-avro repository

	cd /etc/yum.repos.d/
	wget http://download.opensuse.org/repositories/home:sarimkhan/Fedora_17/home:sarimkhan.repo

Step 3: Install ibus-avro

	yum install ibus-avro
	

###Setting IBus as default input method

You may need to set IBus as your default input method so that it starts automatically every time you log on.

 1. Open _Activity_ by moving your mouse to top-left corner of your screeeen.
  

###Using ibus-avro
 1. Run __IBus__ (`Applications -> System Tools -> IBus`) from _Dash_
 2. Open __IBus__ `Preferences` from the top panel icon  
 3. Go to `Input method`
 4. `Select an input method -> Bengali -> Avro`
 5. Now Click `Add` button to add __Avro__ to the list
 6. Now restart __IBus__ from the top panel icon (`Right Click -> Restart`)
 7. Now Press `Ctrl+Space` to toggle between _English_ and _Avro_ (Bengali)
 8. Enjoy __Avro Phonetic!__

	
###Uninstalling ibus-avro

