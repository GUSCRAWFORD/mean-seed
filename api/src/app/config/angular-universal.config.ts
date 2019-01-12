// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

import { Application, Request, Response } from "express";

export function config(app:Application, options:any={}) {
    // Our index.html we'll use as our template
    const template = readFileSync(join(options.distPath||process.cwd(), 'dist', 'browser', 'index.html')).toString();

    // * NOTE :: leave this as require() since this file is built Dynamically from webpack
    const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.bundle');

    const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');
    
    app.engine('html', (_, options, callback) => {
        renderModuleFactory(AppServerModuleNgFactory, {
          // Our index.html
          document: template,
          url: options.req.url,
          // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
          extraProviders: [
            provideModuleMap(LAZY_MODULE_MAP)
          ]
        }).then(html => {
          callback(null, html);
        });
      });
      
      app.set('view engine', 'html');
      app.set('views', join(options.distPath||process.cwd(),'dist', 'browser'));
      
      // Server static files from /browser
      app.get('*.*', express.static(join(options.distPath||process.cwd(),'dist', 'browser')));
      
      // All regular routes use the Universal engine
      app.get('*', (req, res) => {
        res.render(join(options.distPath||process.cwd(), 'dist', 'browser', 'index.html'), { req });
      });
}