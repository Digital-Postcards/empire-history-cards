#! /bin/bash

# pull latest changes
git pull
cd "$(dirname "${BASH_SOURCE[0]}")"/
# install dependencies in case any have changed
cd ../../frontend && npm ci
cd "$(dirname "${BASH_SOURCE[0]}")"/
# install dependencies in case any have changed
cd ../../server && npm ci

