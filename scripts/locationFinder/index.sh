#! /bin/bash

# navigate to the current directory
cd "$(dirname "${BASH_SOURCE[0]}")"/
# enable the virtual environment, if it exists
if [ -d ".venv" ]; then
  source ./.venv/bin/activate
fi
# start the python script
python python/index.py
# start the node script
node --env-file=.env js/index.js
# deactivate the virtual environment
deactivate