import { TS } from "../services/timestamp";
import { Protection } from './session.config';
const express = require('express');
const createError = require('http-errors');
export const config = function (app:any) {
    const { routes } = require('../routes');
    Object.keys(routes).forEach(route=>{
        app.use(`${route}`, routes[route].router)
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
        },
        public sessionProtection?:Protection
    ) {
        Object.keys(this.routeMap).forEach(routePath=>{
            this.mapRoutePath(routePath);
        });
    }
    private mapRoutePath(routePath:string) {
        Object.keys(this.routeMap[routePath]).forEach(method=>{
            var routerArguments:any[] = [routePath];
            if (this.sessionProtection) this.protect(routerArguments, routePath);
            this.handle(routerArguments, routePath, method);
        });
    }
    private protect(routerArguments:any[], routePath:string) {
        routerArguments.push(
            (this.sessionProtection as any).protects(`${this.path}${routePath}`)
        );
    }
    private handle(routerArguments:any[], routePath:string, method:string) {
        routerArguments.push(
            this.routeMap[routePath][method][`$handle_${method}_${this.path}${routePath}`] = async (request:any, response:any, next:any)=>{
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
        this.router[method].apply(this.router, routerArguments);
    }
    router = RouteFactory.expressInstance.Router();
}
