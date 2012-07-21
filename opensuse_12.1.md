---
layout: default
title: Installing ibus-avro on openSUSE 12.1
---


###Installing ibus-avro on openSUSE 12.1

Before installing, please note that ibus-avro requires latest version of some libraries that aren't available in the default repositories of openSUSE 12.1.
During the installation process they'll be automatically installed from  `GNOME-3.4` and `home:sarimkhan` repositories. This will update core libraries of GNOME to version 3.4. If you agree, follow the steps below.

Step 1: Download and Run the [One Click Installer](http://linux.omicronlab.com/ibus-avro.ymp)

![opensuse](/images/opensuse12.1/suse1.png "opensuse")



Step 2: The _One Click Installer_ will be opened in _Yast_, Press _Next_ to continue
![opensuse](/images/opensuse12.1/suse2.png "opensuse")



Step 3: Press _Next_
![opensuse](/images/opensuse12.1/suse3.png "opensuse")



Step 4: Again press _Next_
![opensuse](/images/opensuse12.1/suse4.png "opensuse")



Step 5: It'll ask for confirmation, press _Yes_
![opensuse](/images/opensuse12.1/suse5.png "opensuse")



Step 6: Installation process will begin, required repositories will be fetched. Stay still
![opensuse](/images/opensuse12.1/suse6.png "opensuse")



Step 7: It'll ask to trust the keys, Drag the bottom-right corner of the dialog to stretch it and press _Trust_
![opensuse](/images/opensuse12.1/suse7.png "opensuse")



Step 8: Press _Trust_ again
![opensuse](/images/opensuse12.1/suse8.png "opensuse")



Step 9: Mark _Following Action will be done_, as shown in screenshot.
![opensuse](/images/opensuse12.1/suse9.png "opensuse")



Step 10: A list of required packages will be shown, press _Close_
![opensuse](/images/opensuse12.1/suse10.png "opensuse")



Step 11: Press _Apply_
![opensuse](/images/opensuse12.1/suse11.png "opensuse")



Step 12: Press _Apply_ again
![opensuse](/images/opensuse12.1/suse12.png "opensuse")



Step 13: Wait as the packages will be downloaded and installed.
![opensuse](/images/opensuse12.1/suse13.png "opensuse")



Step 14: Congratulations, installation finished! :)
![opensuse](/images/opensuse12.1/suse14.png "opensuse")

Now Logout from your session and login again.




###Setting up IBus and Avro

Step 1: After logging in, The IBus icon will be shown, Right click on it and click _Preferences_
![opensuse](/images/opensuse12.1/suse15.png "opensuse")



Step 2: In _IBus Preferences_, Go to _Input Method_ tab and click _Select an Input Method_. Navigate to `Bengali > Avro Phonetic`
![opensuse](/images/opensuse12.1/suse16.png "opensuse")



Step 3: Click the _Add_ button to add `Avro Phonetic` to the list of input methods
![opensuse](/images/opensuse12.1/suse17.png "opensuse")



Step 4: Open any text editing app and hit cntrl+space to start writing with avro
![opensuse](/images/opensuse12.1/suse18.png "opensuse")



Step 5: You can Open _Avro Preferences_ by Left clicking Avro Icon (when avro phonetic is active) and selecting _Preferences - Avro_
![opensuse](/images/opensuse12.1/suse19.png "opensuse")


Enjoy :D


###Uninstalling ibus-avro

Step 1: Goto _Activity_ Window, `Applications > System Tools > Install/Remove Software`

Step 2: Locate `ibus-avro` by writing its name in the _Find_ textbox

Step 3: Unmark it or `Right Click > Remove`

Step 4: Press _Apply_
