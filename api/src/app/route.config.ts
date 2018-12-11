import { TS } from "./timestamp";

const express = require('express');
const createError = require('http-errors');
export const config = function (app) {
    const { routes } = require('./routes');
    Object.keys(routes).forEach(route=>{
        app.use(`/${route}`, routes[route].router)
    });
}
export class RouteFactory {
    constructor (
        private routeMap:{
            [key:string]:{
                [key:string]:(request:any, response:any, next:(any)=>any)=>Promise<any>
            }
        }
    ) {
        Object.keys(routeMap).forEach(routePath=>{
            Object.keys(routeMap[routePath]).forEach(method=>{
                this.router[method](routePath, async (request, response, next)=>{
                    var result;
                    try {
                         await routeMap[routePath][method](request, response, next);
                    } catch (exception) {
                        console.error(exception);
                        console.error(`\t${TS()}`);
                        next(createError(exception));
                    }
                });
            });
        });
    }
    router = express.Router();
}