#!/bin/bash
set -e

virtualenv env
source env/bin/activate
pip install -r requirements.txt
