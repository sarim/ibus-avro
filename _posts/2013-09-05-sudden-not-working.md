---
layout: blog_post
title: ibus-avro suddenly not working
---

You were running ibus-avro just fine, now all on a sudden its not working anymore. What to do now ?


##First Aid

Try deleting the `.candidate-selections.json` file in your home folder. Run the following command in terminal.
    
        rm ~/.candidate-selections.json


Now try to start ibus-avro again. 95% time this fix solves the issue.

##Debug
Feeling geeky and want to dig deeper ? Head to the terminal and follow the instructions below to gather some more info about the error.

0. Remove Avro from ibus preferences.
0. Then shut down ibus-daemon and start it in debug mode.

        sudo killall ibus-daemon
        ibus-daemon -vx
        
   NB: Skip this step if you are running a latest version of gnome-shell which have builtin ibus.
0. Open a new tab in terminal, run try to start ibus-avro.

        /usr/bin/env gjs --include-path=/usr/share/ibus-avro /usr/share/ibus-avro/main-gjs.js
0. Now try to switch the language (Cntrl + Space).


Now you should see some geeky debug informations in both tabs.