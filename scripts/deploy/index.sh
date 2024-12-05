#! /bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"/
# pull latest changes
if [[ -v GITHUB_PAT ]]; then
    git pull https://$GITHUB_PAT@github.com/digital-postcards/empire-history-cards
else
    printf "Personal access token not set or is invalid; please enter your credentails:\n"
    git pull
fi

# update the frontend

# install dependencies in case any have changed
cd ../../frontend && npm ci
# build the frontend
npm run build
# copy build files to the apache directory
sudo cp -r build/* /var/www/digitalhum

# update the backend

# install dependencies in case any have changed
cd ../server && npm ci
# build the backend
npm run build
# restart the backend service using pm2
pm2 restart dh-api

# save pm2 state
pm2 save
