const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
import { config } from './config/app.config';
const app = express();

const debug = (tag:string)=>!(
  (
    process.env.DEBUG&&process.env.DEBUG.split(/,/g)
    ||[]
  ) as any
).find(debugTag=>debugTag===tag)
// view engine setup
app.set('views', path.join(process.cwd(),'api','views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(),'api','public')));
config(app);
export { app };
