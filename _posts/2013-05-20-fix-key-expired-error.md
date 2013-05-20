---
layout: blog_post
title: How to fix KEYEXPIRED error in ubuntu
---

If you have been using ibus-avro for a while, you may have encourtered this error when running `apt-get update`. 

	W: GPG error: http://download.opensuse.org ./ Release: The following signatures were invalid: KEYEXPIRED 1366357218


Lets see how to fix that.

0. Open __Ubuntu Software Center__.
0. From Top bar goto __Edit > Software Sources__
	
	![image](/images/ubuntu13.04/k1.png)
0. Goto __Authentication__ Tab and select the `sarimkhan OBS Project` key.
	
	![image](/images/ubuntu13.04/k2.png)
0. Press Remove and confirm by entering your password.
0. Now open up terminal and add the correcponding key for your OS, for example ubuntu 13.04:
	
		wget -q http://download.opensuse.org/repositories/home:/sarimkhan/xUbuntu_13.04/Release.key -O- | sudo apt-key add -
0. Now you can update your software sources without any problem.

		sudo apt-get update
		
0. Have Fun and keep rocking.