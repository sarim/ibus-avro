# Avro phonetic for Linux in IBus
Avro phonetic implementation for Linux in IBus.

This branch implements ibus-avro implementation in golang. Work in progress. Here be dragons.

# Dependencies

- Vala: at least version 0.48

    use ppa in older ubuntu versions (< 20.04)
    ```
    sudo add-apt-repository ppa:vala-team/next
    ```
- Gtk: `libgtk-3-dev`
- Ibus: oviously
- Meson: use apt for 20.04, for older use pip. Consult meson website.
- Ninja: use apt for 20.04, 18.04. For older download and install binary from [github](https://github.com/ninja-build/ninja/releases)
- Go: should work with any recent versions.


# Install

```
make prefix=/usr
sudo make prefix=/usr install
```

# Run
If installation is successful, run
```
ibus restart
```
Now ubuntu settings app, in region and language section, add (+) Input Sources. `Bangla` -> `Bangla (Avro Phonetic Beta)` should appear.