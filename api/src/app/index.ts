/**
 * Common express setup and config
 */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const STATIC_UI = path.join(process.cwd(),'public','ui');
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
console.info(`📂  Serving static files from: ${STATIC_UI}`)
app.use(express.static(STATIC_UI));
config(app); // Configure specifics...
export { app };
