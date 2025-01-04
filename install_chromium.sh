#!/bin/bash

# Update package list
apt-get update

# Install dependencies
apt-get install -y wget ca-certificates gnupg
apt-get install -y libxss1 libappindicator3-1 libindicator7

# Install Chromium
apt-get install -y chromium-browser
echo "Chromium installed at: $(which chromium-browser)"