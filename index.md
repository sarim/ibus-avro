---
layout: default
title: ibus-avro - Avro Phonetic Bangla typing for Linux
---

### Welcome to Avro Phonetic for Linux

**ibus-avro** is the port of popular [Avro Phonetic](http://www.omicronlab.com/avro-keyboard.html) Bangla typing method to Linux. This software works as an Engine (plugin) of [IBus](http://code.google.com/p/ibus/) and let users type in English and on-the-fly transliterate them phonetically to Bangla. 

**Notable features:**

* 100% compatibility with the current Avro Phonetic scheme.
* Support for preview window to see originally typed text right under the cursor.
* Dictionary support can predict and suggest phonetically similar words with correct spelling on the fly.
* Autocorrect support brings commonly used English words to Bangla (like, Facebook, download etc.) even with their original English spelling.
* Customizable.

 ![ibus-avro on Ubuntu](/images/screenshot.png "ibus-avro on Ubuntu")

### Project status
Stable. Current version is 1.2. See [version history](https://github.com/sarim/ibus-avro/releases).

### Download and installation

#### Debian/Ubuntu
Official repositories of following Linux distributions contain ibus-avro

* **Ubuntu 16.04 LTS (Xenial Xerus)** [backports]
* **Ubuntu 18.04 LTS (Bionic Beaver)** [backports]
* **Ubuntu 20.04 LTS (Focal Fossa)**
* **Ubuntu 20.10 (Groovy Gorilla)**
* **Ubuntu 21.04 (Hirsute Hippo)**
* **Debian 11 (Bullseye)**
* **Debian Unstable (Sid)**

For these distributions, you can simply install `ibus-avro` from software center (or equvalent tool). For example to install it from command line using apt:
```sh
sudo apt-get install ibus-avro
```
For an older version of ubuntu or debian (and other debian based distributions, ex: Raspbian) you can add debian sid repository with a lower pin-priority to apt, and install ibus-avro from there. Only attempt this if you're an advanced user with detailed knowledge of apt pinning.

#### Arch and derivatives
AUR contains a community maintained package named `ibus-avro-git`. You can install it using your preferred tool. For example to install using `yay`:
```
yay -S ibus-avro-git
```

#### Others

For using on other distributions, you'll need to download the source code from [github repository](https://github.com/sarim/ibus-avro). Please follow the [readme](https://github.com/sarim/ibus-avro/blob/master/README.md) file for detail instructions.

### Usage

After installing you have to restart ibus, if you're unsure how to do that, restart your session (logout/login) or restart your computer. Now you can add `Avro Phonetic` to Input Methods using your distribution's setting gui. For `Ubuntu`: `Setting` -> `Region & Language` -> `Input Sources`.

### Bangla typing guide
Here is the Bangla tutorial (from the Windows edition) on how to type with Avro Phonetic: [Bangla typing with Avro Phonetic](http://www.omicronlab.com/download/pdf/Bangla%20Typing%20with%20Avro%20Phonetic.pdf).

### License
ibus-avro is licensed under [Mozilla Public License 1.1](https://github.com/sarim/ibus-avro/blob/master/MPL-1.1.txt) ("MPL"), an open source/free software license.
