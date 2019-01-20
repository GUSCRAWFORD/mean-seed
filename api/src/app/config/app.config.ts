const express = require('express');
const path = require('path');
/**
 * Tie your middleware together in this root process start configuration:
 */
import { config as routes} from './route.config';     // Configure and map all control-routes
import { config as errors } from './errors.config';   // Configure errors for other client Accept headers
import { config as session} from './session.config';  // Configure session fundamentals
// import { config as jwt } from './session-jwt.config'; // Configure jwt specifics
import { Application } from 'express';
const createError = require('http-errors');
/**
 * Import singletons needed to control middleware
 */
export const DEFAULT_PROFILE = Promise.resolve(Object.assign({},{username:'default'}));
export const config = function (app:Application) {
  /**
   * Config services
   */
  // session(app,{ // Run top-level session configurations
  //   sessionConfigs:[
  //     // ()=>jwt(app, {  // Configure specific session providers and types
  //     //   /** pass config options here */
  //     //   onLogin:(username, password)=>DEFAULT_PROFILE,
  //     //   onLogout:(username)=>Promise.resolve({}),
  //     //   onProfile:(username)=>DEFAULT_PROFILE
  //     // })
  //   ]
  // });
  routes(app);
  errors(app); // Run error config for application

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    //try {
      //res.type('html').status(200).sendFile(path.join(process.cwd(), 'public','ui','index.html'));
    //} catch (e) {

      //next(createError(404));
      res.type('html').status(200).sendFile(path.join(process.cwd(), 'public','ui','index.html'));
    //}
  });

  //app.use(express.static(path.join(process.cwd(),'public','ui')));
  //app.use(/\/*/,express.static(path.join(process.cwd(),'public','ui')));
}