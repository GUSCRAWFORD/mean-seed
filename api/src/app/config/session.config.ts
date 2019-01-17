import { Request, Response } from "express";

export const DEFAULT_SESSION_SECRET = process.env.SESSION_SECRET || 'hardcoded-secret';
export const DEFAULT_SESSION_HEADER = process.env.SESSION_HEADER || 'x-token';
export class SessionConfigOptions {
    headerName?:string = DEFAULT_SESSION_HEADER;
    host?:string = process.env.HOST || 'localhost:3000';
    expiryHours?:string = process.env.SESSION_EXPIRY_HOURS||'2';
    expiryMinutes?:string = process.env.SESSION_EXPIRY_MINUTES||'5';
    sessionConfigs?:Array<(...any:any[])=>any>=[];
    secret?:string = DEFAULT_SESSION_SECRET;
}
export class Protection {
    constructor(
        private paths:{[key:string]:(req:any,res:any,next:any)=>Promise<any>}={},
        public authenticate:(req:any,res:any,next:any)=>Promise<any>
    ) { }
    protect(...path:string[]) {
        path.forEach(routePath=>this.paths[routePath] = this.authenticate);
    }
    protects(path:string) {
        var protectionKey = Object.keys(this.paths).find(possibleMatch=>!!path.match(new RegExp(possibleMatch)));
        return protectionKey?this.paths[protectionKey]:(q:Request,s:Response,x:(q:Request,s:Response,err?:any)=>any)=>x(q,s,null);
    }
}
/**
 * 
 * @param app
 */
export function config(
    app:any,
    options?:SessionConfigOptions
 ) {
    options = Object.assign(new SessionConfigOptions(), options);
    if (options.sessionConfigs) options.sessionConfigs.forEach(
        sessionConfig=>sessionConfig()
    )
}