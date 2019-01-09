# Getting Started
![build](https://travis-ci.com/GUSCRAWFORD/mean-seed.svg?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/a985b5bc91c864c70d4e/maintainability)](https://codeclimate.com/github/GUSCRAWFORD/mean-seed/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a985b5bc91c864c70d4e/test_coverage)](https://codeclimate.com/github/GUSCRAWFORD/mean-seed/test_coverage)

## Quick Ref
```

# First time?
yarn yarn install && mongodb:reset-users &&  yarn start

```

## What is MEAN Seed?

"MEAN" seed is starter application with some elementary pre-fabricated components and configurations:

1. A well-delegated express application
2. A schema for statically declaring "route-maps" and managing security
3. A **user** management service
   1. JWT Session Management
4. A **file** management service

## Why is it Useful?

1. The pre-fab components will broadly configure and use middleware as per common recipes
2. Start with more out-of-the-box


## Envionrment Pre-requisites

1. [📦 Node.js 8.11.4](https://nodejs.org/download/release/v8.11.4/)
2. [📦 MongoDB 3.4+](https://www.mongodb.com/download-center/community)

## Start Local @project

1. `yarn mongodb:reset-users`
2. `yarn start`

# Yarn Commands

* **start** ℹ️ Run the api project with usual development settings → `pm2 kill && pm2 start config/local-ecosystem.config.js`
* **debug** ℹ️ Run `mongod` and presume the API is being run in debug mode via **vscode** (see .vscode/launch.json) → `pm2 kill && pm2 start config/debug-local-ecosystem.config.js`
* **mongod:auth-disabled** ℹ️  Runs your `mongod` with **authorization off** so the *dbAdmin* user(s) can be created → `cd mongodb && pm2 start --name \"mongod\" npm -- run start`
* **mongod:auth-enabled** ℹ️  Runs your `mongod` with **authorization on** → `cd mongodb && pm2 start --name \"mongod\" npm -- run start:auth-enabled`
* **mongodb:reset-admin** ℹ️  Resets the *admin user(s)* as per the namesake script in *mongodb/scripts* → `pm2 kill && yarn mongod:auth-disabled && cd mongodb && yarn create:admin`
* **mongodb:reset-app-users** `pm2 kill && yarn mongod:auth-enabled && cd mongodb && yarn create:app-users`
* **mongodb:reset-users** `yarn mongodb:reset-admin && yarn mongodb:reset-app-users`
* **build:api** ℹ️  Build the API project from *typescript* source → `cd api && yarn rebuild`
* **build:models** ℹ️  Build the models project from *typescript* source → `cd models && yarn rebuild`
* **build** `yarn build:models && yarn build:api`
* **test** `yarn test:api`
* **test:api** ℹ️  Run unit tests & coverage → `cd api && yarn test:coverage`

## MongoDB

ℹ️  The mongodb sub-project is intended to mimic your production data-center for a given environment

`cd mongodb`

* **mongo** ℹ️ Run *mongo* client on desired port → `mongo --port 27017`
* **mongod** ℹ️ Run *mongo* server on desired port → `mongod --port 27017`
* **mongodump** ℹ️ Run *mongodump* client on desired port and treat trailing param as output path → `mongodump --port 27017 -o `
* **mongorestore** ℹ️ Run *mongorestore* on desired port → `mongorestore --port 27017`
* **mongo:auth-enabled** ℹ️ Run **mongod** with AUTH constant `true` → `yarn mongo --eval \"const AUTH = true;\"`
* **mongo:auth-disabled** ℹ️ Run **mongod** with AUTH constant `false` → `yarn mongo --eval \"const AUTH = false;\"`
* **start** → `yarn mongod -f config/mongod-authorization-disabled.conf`
* **start:auth-enabled** → `yarn mongod -f config/mongod.conf`
* **reset** ℹ️ Run the namesake **reset** script in scripts, create indices etc. → `yarn mongo:auth-enabled scripts/reset.mongo.js`
* **create:admin** → `yarn mongo:auth-disabled scripts/create-admin.mongo.js`
* **create:app-users** → `yarn mongo:auth-enabled scripts/create-app-users.mongo.js`