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
export class RouteFactory {
    static expressInstance = express;
    constructor (
        public path:any,
        public routeMap:{
            [key:string]:{
                [key:string]:(request:any, response:any, next:(any:any)=>any)=>Promise<any>
            }
        },
        public sessionProtection?:Protection
    ) {
        Object.keys(this.routeMap).forEach(routePath=>{
            Object.keys(routeMap[routePath]).forEach(method=>{
                var routerArguments:any[] = [routePath];
                if (this.sessionProtection)
                    routerArguments.push(
                        this.sessionProtection.protects(`${this.path}${routePath}`)
                    );
                routerArguments.push(
                    routeMap[routePath][method][`$handle_${method}_${this.path}${routePath}`] = async (request:any, response:any, next:any)=>{
                        var result;
                        try {
                            result = await routeMap[routePath][method](request, response, next);
                            response.json(result);
                        } catch (exception) {
                            console.error(exception);
                            console.error(`\t${TS()}`);
                            next(createError(exception));
                        }
                    }
                );
                this.router[method].apply(this.router, routerArguments);
            });
        });
    }
    router = RouteFactory.expressInstance.Router();
}
