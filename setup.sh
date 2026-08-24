#!/usr/bin/env bash
# =============================================================================
# IBus Avro Keyboard - Automated Installer & Shortcut Configurator
# =============================================================================
set -e

# Terminal Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}      IBus Avro Keyboard Installer for Linux        ${NC}"
echo -e "${BLUE}====================================================${NC}"

# 1. Detect Package Manager
if [ -x "$(command -v apt-get)" ]; then
    PM="apt"
elif [ -x "$(command -v dnf)" ]; then
    PM="dnf"
elif [ -x "$(command -v pacman)" ]; then
    PM="pacman"
else
    echo -e "${RED}[-] Error: Unsupported package manager. Please install dependencies manually.${NC}"
    exit 1
fi

echo -e "${GREEN}[+] Detected package manager: $PM${NC}"

# 2. Install Dependencies
echo -e "${YELLOW}[*] Installing development and runtime dependencies...${NC}"
if [ "$PM" = "apt" ]; then
    sudo apt-get update
    sudo apt-get install -y git libibus-1.0-dev automake autoconf make gjs ibus
elif [ "$PM" = "dnf" ]; then
    sudo dnf install -y git automake autoconf make gjs ibus ibus-devel
elif [ "$PM" = "pacman" ]; then
    sudo pacman -S --needed --noconfirm git automake autoconf make gjs ibus
fi

# 3. Determine Build Directory
if [ -f "configure.ac" ] && [ -f "main-gjs.js" ]; then
    echo -e "${GREEN}[+] Running inside ibus-avro repository. Using local files...${NC}"
    BUILD_DIR=$(pwd)
    IS_LOCAL=true
else
    echo -e "${YELLOW}[*] Running remotely. Cloning repository to a temporary directory...${NC}"
    BUILD_DIR=$(mktemp -d /tmp/ibus-avro-build.XXXXXX)
    git clone https://github.com/mdnaimul22/ibus-avro.git "$BUILD_DIR"
    IS_LOCAL=false
fi

# 4. Build and Install
cd "$BUILD_DIR"
echo -e "${YELLOW}[*] Preparing build system...${NC}"
aclocal
autoconf
automake --add-missing

echo -e "${YELLOW}[*] Configuring and installing...${NC}"
./configure --prefix=/usr
sudo make install

# 5. Clean Up (if cloned remotely)
if [ "$IS_LOCAL" = false ]; then
    echo -e "${YELLOW}[*] Cleaning up temporary files...${NC}"
    rm -rf "$BUILD_DIR"
fi

# 6. Configure IBus Preferences & Hotkeys
echo -e "${YELLOW}[*] Setting up IBus input sources and shortcuts...${NC}"

# Check current preloaded engines and add ibus-avro if missing
gsettings set org.freedesktop.ibus.general preload-engines "['ibus-avro', 'xkb:us::eng']"
gsettings set org.freedesktop.ibus.general engines-order "['ibus-avro', 'xkb:us::eng']"

# Add F12 as a toggle shortcut alongside Super+Space
gsettings set org.freedesktop.ibus.general.hotkey triggers "['<Super>space', 'F12']"

# Restart IBus daemon to apply settings
echo -e "${YELLOW}[*] Restarting IBus daemon...${NC}"
ibus restart || ibus-daemon -drx

echo -e "${BLUE}====================================================${NC}"
echo -e "${GREEN}[+] Avro Keyboard has been successfully installed!${NC}"
echo -e "${GREEN}[+] Press 'F12' or 'Super + Space' to toggle layout.${NC}"
echo -e "${BLUE}====================================================${NC}"
