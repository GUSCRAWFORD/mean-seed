import { Request, Response } from 'express';
import * as session from 'express-session';
import { Passport, Authenticator } from 'passport';
import { DEBUG, Sequence } from '../services';
const DEBUG_TOPIC='session';
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
const SESSION_CONFIG = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET||DEFAULT_SESSION_SECRET,
    signed: true
};
const PASSPORT = new Passport();
/**
 * 
 * @param app
 */
export function config(
    app:any,
    options?:SessionConfigOptions
 ) {
    options = Object.assign(new SessionConfigOptions(), options);

    if (DEBUG(DEBUG_TOPIC))  console.info(`⚙️  👤  ${Sequence.$('configSequence').label}  Use Express-Session`);
    app.use(session(SESSION_CONFIG));
    
    if (options.sessionConfigs) options.sessionConfigs.forEach(
        sessionConfig=>{
            if (DEBUG(DEBUG_TOPIC))  console.info(`⚙️  👤  ${Sequence.$('configSequence').label}  Sub-session Config`);
            sessionConfig(PASSPORT /* singleton-middleware injections */);
        }
    )

    if (DEBUG(DEBUG_TOPIC))  console.info(`⚙️  👤  ${Sequence.$('configSequence').label}  Initialize Passport`);
    app.use(PASSPORT.initialize());

    if (DEBUG(DEBUG_TOPIC))  console.info(`⚙️  👤  ${Sequence.$('configSequence').label}  Use Passport-Session`);
    app.use(PASSPORT.initialize());
}