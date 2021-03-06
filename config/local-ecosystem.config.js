module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // Example application:
    // {
    //   name      : 'API',
    //   script    : 'app.js',
    //   env: {
    //     COMMON_VARIABLE: 'true'
    //   },
    //   env_production : {
    //     NODE_ENV: 'production'
    //   }
    // },
    {
      script:'mongod',
      cwd:'mongodb',
      args:'--port 27017 -f config/mongod.conf'
    }
    ,{
      script:'tsc',
      cwd:'./api/src',
      args:'--watch'
    }
    ,{
      name:'api',
      cwd:'api',
      script:'./dist/bin/api/src/www.js',
      watch:'./dist/bin',
      env: require('./local-env')
    }
    // ,{
    //   name:'angular app',
    //   cwd:'angular-app',
    //   script:'yarn start',
    //   env: require('./local-env')
    // }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    // production : {
    //   user : 'node',
    //   host : '212.83.163.1',
    //   ref  : 'origin/master',
    //   repo : 'git@github.com:repo.git',
    //   path : '/var/www/production',
    //   'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    // },
    // dev : {
    //   user : 'node',
    //   host : '212.83.163.1',
    //   ref  : 'origin/master',
    //   repo : 'git@github.com:repo.git',
    //   path : '/var/www/development',
    //   'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
    //   env  : {
    //     NODE_ENV: 'dev'
    //   }
    // }
  }
};
