---
layout: blog_post
title: How to fix Arabic output on Archlinux and Gnome 3.20
---

There's a bug thats been popping up on Archlinux where ibus-avro outputs _arabic_ instead of **bengali**.

But, there's a simple workaround that fixes the problem.

## Fix

* Open `/usr/share/ibus/component/ibus-avro.xml` in a text editor as **root**.

```bash
sudo vim /usr/share/ibus/component/ibus-avro.xml
```
* Now change line 20

from

```xml
			<layout>bn</layout>
```

to

```xml
			<layout>us</layout>
```

* Save the file and reboot (or just log out and log back in)

## That should be it.

#### If you update ibus-avro again, you might need to make this change again.