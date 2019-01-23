
const createError = require('http-errors');
import { TS } from "../services/timestamp";
import { RouteFactory, RoutePath } from './route.config';
export class ProtectedRouteFactory extends RouteFactory {
    constructor (
        public path:any,
        public routeMap:{
            [key:string]: RoutePath
        },
        public sessionProtection?:any
    ) {
        super(path,routeMap);
        // Object.keys(this.routeMap).forEach(routePath=>{
        //     this.mapRoutePath(routePath);
        // });
    }
    protected mapRoutePath(routePath:string) {
        Object.keys(this.routeMap[routePath]).forEach(method=>{
            var routerArguments:any[] = [routePath];
            if (this.sessionProtection) this.protect(routerArguments, routePath);
            //this.handle(routerArguments, routePath, method);
        });
        super.mapRoutePath(routePath);
    }
    protected protect(routerArguments:any[], routePath:string) {
        routerArguments.push(
            (this.sessionProtection as any).protects(`${this.path}${routePath}`)
        );
    }
}