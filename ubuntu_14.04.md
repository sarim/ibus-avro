---
layout: default
title: Installing ibus-avro on Ubuntu 14.04
---

### Installing ibus-avro on Ubuntu 14.04

Open **Terminal** and enter the following commands one by one.

Step 1: Add ibus-avro repository

	sudo add-apt-repository "deb http://download.opensuse.org/repositories/home:/sarimkhan/xUbuntu_14.04/ ./"


Step 2: Add key

	wget -q http://download.opensuse.org/repositories/home:/sarimkhan/xUbuntu_14.04/Release.key -O- | sudo apt-key add -


Step 3: Update package list

	sudo apt-get update


Step 4: Install ibus-avro

	sudo apt-get install ibus-avro-trusty

Step 5: Now you need to logout and login again or restart your computer.


### Using ibus-avro
 1. Click the IM icon in menubar and Select __Text Entry Setting__
    
    ![Text Entry](/images/ubuntu13.10/1.jpg "Text Entry")
 2. In __Text Entry Setting__ window click `+` icon (marked by arrow) in left pane. Write `avro` in the search box (marked by arrow). Choose `Bengali (Avro Phonetic)` from the list and press `Add` button to add __Avro__ to the list.  
    
    ![Text Entry Setting](/images/ubuntu14.04/2.jpg "Text Entry Setting")
 3. (Optional) The keyboard shortcut to switch input method has been changed to `Super+Space` since ubuntu 13.10. You can change it to your preference from __Text Entry Setting__ window.
 4. Open any text editing software (like, `gedit`). Now Press `Super+Space` to toggle between _English_ and _Avro_ (Bengali)
 5. Enjoy __Avro Phonetic!__  
    
    ![ibus-avro on Ubuntu](/images/ubuntu13.10/3.jpg "ibus-avro on Ubuntu")

	
### Uninstalling ibus-avro

Step 1: Open __Text Entry Setting__ and remove Avro Phonetic by clicking `-` icon.

Step 2: Open **Terminal** and enter the following command:

	sudo apt-get remove ibus-avro-trusty
	