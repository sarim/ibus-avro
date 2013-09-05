#!/bin/sh

SITEVER=$(git describe --long HEAD | sed "s/-[0-9a-z]*$//")
sed -i "" "s/<meta siteversion=.*$/<meta siteversion=\"$SITEVER\">/" _layouts/default.html
