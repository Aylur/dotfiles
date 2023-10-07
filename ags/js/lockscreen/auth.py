#! /usr/bin/env python

import pam
import sys
import getpass

print(pam.authenticate(getpass.getuser(), sys.argv[1]));
