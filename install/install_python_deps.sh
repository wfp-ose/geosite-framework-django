#!/bin/bash
VENV=sparc2
source ~/.bash_aliases
workon $VENV
#############
# Install Django Dependencies
rm -fr /home/vagrant/.venvs/$VENV/build/  # Clear old builds if they failed for some reason
pip install -r requirements.txt
