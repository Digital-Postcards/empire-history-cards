#! /bin/bash

# pull latest changes
git pull

# update the frontend

cd "$(dirname "${BASH_SOURCE[0]}")"/
# install dependencies in case any have changed
cd ../../frontend && npm ci
# build the frontend
npm run build
# copy build files to the apache directory
sudo cp -r build/* /var/www/digitalhum

# update the backend

# install dependencies in case any have changed
cd ../../server && npm ci
# build the backend
npm run build
# restart the backend service using pm2
pm2 restart dh-api

# save pm2 state
pm2 save
