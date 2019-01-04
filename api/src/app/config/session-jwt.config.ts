
import { DEBUG } from '../services/debug';
import { SessionConfigOptions, Protection } from './session.config';
import { GET_PROFILE_FACTORY, HANDLE_LOGIN_FACTORY, HANDLE_LOGOUT_FACTORY, AUTHENTICATE_FACTORY } from '../services/session-jwt';
import { Passport } from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
export * from './session.config';
// JWT Strategy
abstract class ExtractJwt {
    static fromCookies (cookieName:string) {
        return (req:any)=>{
            if (DEBUG("jwt")) console.debug(`🍪  🔍  Looking for JWT on cookie: ${cookieName}`);
            if (typeof req.headers.cookie!=='string') return null;
            let cookies = req.headers.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].split('=');
                if (cookie[0].trim()===cookieName) {
                    if (DEBUG("jwt")) console.debug(`🍪  🔑  Found: ${cookieName} (${cookie[1]})`);
                    return cookie[1];
                }
            }
            return null;
        }
    }
}

export class JwtService {
    static intance = new JwtService();
    session:{
        [key:string]:JwtProtection
    } = {};
}
export class JwtProtection extends Protection {
    constructor(
        paths:{[key:string]:(req:any,res:any,next:any)=>Promise<any>}={},
        authenticate:(req:any,res:any,next:any)=>Promise<any>
    ) {
        super (paths, authenticate);
    }
}
export class JwtSessionConfigOptions extends SessionConfigOptions {
    algorithms?:string[] = process.env.SESSION_JWT_ALGORITHMS && process.env.SESSION_JWT_ALGORITHMS.split(',')||['HS256']
    audience?:string = process.env.SESSION_JWT_AUDIENCE || this.host;
    issuer?:string = process.env.SESSION_JWT_ISSUER || this.host;
    loginPath?:string = process.env.SESSION_JWT_LOGIN_PATH||'/users/login';
    logoutPath?:string = process.env.SESSION_JWT_LOGOUT_PATH||`/users/logout`;
    onLogin?:(username:string,password:string)=>Promise<any>;
    onLogout?:(username:string)=>Promise<any>;
    onAuthenticate?:(success:any,req:any)=>Promise<any>;
    onFailedAuthenticate?:(error:any,req:any)=>Promise<any>;
    onProfile?:(user:any)=>Promise<any>;
    sign?:(sub:string, payload:any)=>any;
}
/**
 * 
 * @param app
 */
export function config(
    app:any,
    options: JwtSessionConfigOptions
) {
    const PASSPORT = new Passport();
    options = Object.assign(new JwtSessionConfigOptions(),options);
    PASSPORT.use(
        new JwtStrategy(
            {
                jwtFromRequest : ExtractJwt.fromCookies(options.headerName as string),
                passReqToCallback:true,
                secretOrKey: options.secret,
                issuer: options.issuer,
                //ignoreExpiration:false,
                audience: options.audience,
                algorithms: options.algorithms
            },
            (req:any, decodedJwt:any, done:any)=>{
                //console.info(req);
                if (DEBUG("jwt")) {
                    console.info(`🔑  👤  Authenticating request:`);
                    console.log(decodedJwt);
                }
                return done(null, decodedJwt);
            }
        )
    );
    JwtService.intance.session[options.headerName as string] = new JwtProtection({ /** other paths? */ }, AUTHENTICATE_FACTORY(options, PASSPORT));
    mapRoutes(app, options, PASSPORT);
    return app;
}
function mapRoutes (app:any, options: JwtSessionConfigOptions, PASSPORT: any) {
    app.post(`${options.loginPath}`, HANDLE_LOGIN_FACTORY(options));
    app.get(`${options.loginPath}`, AUTHENTICATE_FACTORY(options, PASSPORT), GET_PROFILE_FACTORY(options));
    app.get(`${options.logoutPath}`, AUTHENTICATE_FACTORY(options, PASSPORT), HANDLE_LOGOUT_FACTORY(options));
    app.post(`${options.logoutPath}`, AUTHENTICATE_FACTORY(options, PASSPORT), HANDLE_LOGOUT_FACTORY(options));
    app.put(`${options.logoutPath}`, AUTHENTICATE_FACTORY(options, PASSPORT), HANDLE_LOGOUT_FACTORY(options));
}