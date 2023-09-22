#! /usr/bin/env nix-shell
#! nix-shell -i python3 -p python3Packages.python-pam

import pam
import sys
import getpass

print(pam.authenticate(getpass.getuser(), sys.argv[1]));
