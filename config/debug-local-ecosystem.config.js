const config = require('./local-ecosystem.config');
config.apps.splice(
  config.apps.findIndex(app=>app.name==='api'),
  1
);
module.exports = config;