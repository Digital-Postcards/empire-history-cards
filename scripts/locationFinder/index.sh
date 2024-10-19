#! /bin/bash

# navigate to the current directory
cd "$(dirname "${BASH_SOURCE[0]}")"/
# enable the virtual environment, if it exists
if [ -d ".venv" ]; then
  source ./.venv/bin/activate
else
  echo "!! RECOMMENDED: Highly recommended to use a virtual environment when you run Python scripts !!"
fi
# start the python script
python index.py
# deactivate the virtual environment
deactivate