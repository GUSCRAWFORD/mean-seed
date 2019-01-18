# Getting Started
[![Build Status](https://travis-ci.com/GUSCRAWFORD/mean-seed.svg?branch=master)](https://travis-ci.com/GUSCRAWFORD/mean-seed)
[![Maintainability](https://api.codeclimate.com/v1/badges/a985b5bc91c864c70d4e/maintainability)](https://codeclimate.com/github/GUSCRAWFORD/mean-seed/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a985b5bc91c864c70d4e/test_coverage)](https://codeclimate.com/github/GUSCRAWFORD/mean-seed/test_coverage)


## What is MEAN Seed?

"MEAN" seed is starter application with some elementary pre-fabricated components and configurations:

1. A well-delegated express application
2. A schema for statically declaring "route-maps" and managing security
3. Some utility services
   1. A "debug" topic helper function
   2. Foundational service for managing "in-memory" data
   3. A uniform "timestamp" service for outputting a current date in locale
4. A unit test configuration with coverage
  * Mocha
  * Sinon
  * Istanbul
5. An extensible `pm2` environment config

## Why is it Useful?

1. The pre-fab components configure and use middleware as per common recipes while naturally delegating the separation of concerns for you developing enterprise grade software in express
2. Start with more out-of-the-box
3. Start with an express application and a typescriipt build pipeline
4. Start with a test-driven-development approach


## Envionrment Pre-requisites

1. [📦 Node.js 8.11.4](https://nodejs.org/download/release/v8.11.4/)

## Start Local @project

1. `yarn start`

# Yarn Commands

* **start** ℹ️ Run the api project with usual development settings → `pm2 kill && pm2 start config/local-ecosystem.config.js`
* **debug** ℹ️ Run other services and presume the API is being run in debug mode via **vscode** (see .vscode/launch.json) → `pm2 kill && pm2 start config/debug-local-ecosystem.config.js`
* **build:api** ℹ️  Build the API project from *typescript* source → `cd api && yarn rebuild`
* **build:models** ℹ️  Build the models project from *typescript* source → `cd models && yarn rebuild`
* **build** `yarn build:models && yarn build:api`
* **test** `yarn test:api`
* **test:api** ℹ️  Run unit tests & coverage → `cd api && yarn test:coverage`

# Deployment

## 