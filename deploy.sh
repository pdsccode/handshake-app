#!/bin/bash

yarn install
yarn add https://github.com/ninjadotorg/handshake-i18n

cp ./deployment/conf/.production.env.js ./.env.js
yarn build
bash ./deployment/deploy.sh production

rm -r dist

cp ./deployment/conf/.staging.env.js ./.env.js
yarn build
bash ./deployment/deploy.sh staging
