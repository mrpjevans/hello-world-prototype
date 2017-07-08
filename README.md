# hello-world-prototype

## Installation

This repo no longer contains the db and mode_modules required, so there is an
installation process to follow.

After cloning or downloading, cd to the root directory and issue the following
commands in order:

- $ npm install -g sequelize-cli
- $ npm install
- $ sequelize db:migrate
- $ sequelize db:seed:all

To start the server (with debug output):

- $ DEBUG=hello-world-prototype:* npm start

**Please Note** This version contains 2 private api keys, so is not for public
distribution. The final version will not contain these keys and the user will
be required to configure them before running up the server.