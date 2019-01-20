/**
 * Common express setup and config
 */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
/**
 * App specific config
 */
import { config } from './config/app.config';
const app = express();

// view engine setup
app.set('views', path.join(process.cwd(),'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
console.info(`📂  Serving static files from: ${path.join(process.cwd(),'public')}`)
//app.use(express.static(path.join(process.cwd(),'public')));
//app.use('/*',express.static(path.join(process.cwd(),'public')));
app.use(express.static(path.join(process.cwd(),'public','ui')));
config(app); // Configure specifics...
//app.get('*',(req,res)=>res.sendFile(path.join(process.cwd(), 'public/index.html')))
export { app };
