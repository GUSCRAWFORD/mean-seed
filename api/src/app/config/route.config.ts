import { TS } from "../services/timestamp";
const express = require('express');
const createError = require('http-errors');
const API_ROOT = process.env.API_ROOT || '';
export const config = function (app:any) {
    const { routes } = require('../routes');
    Object.keys(routes).forEach(route=>{
        app.use(`${API_ROOT?API_ROOT+'/':''}${route}`, routes[route].router)
    });
}
export type RoutePath = {
    [key:string]:(request:any, response:any, next:(any:any)=>any)=>Promise<any>
} & {
    serialize?:string;
};
export class RouteFactory {
    static expressInstance = express;
    constructor (
        public path:any,
        public routeMap:{
            [key:string]: RoutePath
        }
    ) {
        Object.keys(this.routeMap).forEach(routePath=>{
            this.mapRoutePath(routePath);
        });
    }
    protected mapRoutePath(routePath:string) {
        Object.keys(this.routeMap[routePath]).forEach(method=>{
            var routerArguments:any[] = [routePath];
            this.handle(routerArguments, routePath, method);
        });
    }
    protected handle(routerArguments:any[], routePath:string, method:string) {
        routerArguments.push(
            (this.routeMap[routePath][method] as any)[`$handle_${method}_${this.path}${routePath}`] = async (request:any, response:any, next:any)=>{
                var result;
                try {
                    result = await this.routeMap[routePath][method](request, response, next);
                    if (result) response[
                        (this.routeMap[routePath].serialize as any)||this.routeMap.serialize||'json'
                    ](result);
                } catch (exception) {
                    console.error(exception);
                    console.error(`\t${TS()}`);
                    next(createError(exception));
                }
            }
        );
        if (typeof this.router[method] === 'function') this.router[method].apply(this.router, routerArguments);
        else console.warn(`⚠️  this.router.${method} doesn't appear to be a route-handler...`)
    }
    router = RouteFactory.expressInstance.Router();
}
