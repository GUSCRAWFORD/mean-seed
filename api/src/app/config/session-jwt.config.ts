
import { DEBUG } from '../services/debug';
import { SessionConfigOptions, Protection } from './session.config';
import { Passport } from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import * as Jwt from 'jsonwebtoken';
import { TS } from '../services/timestamp';
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

    JwtService.intance.session[options.headerName as string] = new JwtProtection({
        /** other paths? */
    }, authenticate);
    app.post(`/${options.loginPath}`, handleLogin);
    app.get(`/${options.loginPath}`, authenticate, getProfile);
    app.get(`/${options.logoutPath}`, authenticate, handleLogout);
    app.post(`/${options.logoutPath}`, authenticate, handleLogout);
    app.put(`/${options.logoutPath}`, authenticate, handleLogout);
    async function authenticate (req:any,res:any,next:any) {
        return PASSPORT.authenticate(
            "jwt",
            { session: false, failWithError: req.app.get('env') === 'development' },
            async (err, success)=>{
                const GENERAL_FAIL = async (err:any)=>{
                    if (options.onFailedAuthenticate)
                        await options.onFailedAuthenticate(err, req);
                    err.status = 401;
                    throw err;
                }
                console.info(`🔑' JWT: ${JSON.stringify(success)}`);
                if (err) {
                    console.error(`🛑 err: ${err}`+TS());
                    GENERAL_FAIL(err);
                }
                console.error(`✅ success: ${JSON.stringify(success)}`+TS());
                req.user = success;
                if (!success)  {
                    GENERAL_FAIL(err = new Error('unauthorized'))
                }
                if (options.onAuthenticate)
                    await options.onAuthenticate(success, req);
                // if (UsersController.instance.sessions && (!success || !UsersController.instance.sessions[success.sub.replace(/\./g,'')])) {
                //     console.log(UsersController.instance)
                //     err = new Error('session not found');
                //     err.status = 401;
                //     throw err;
                // }
                return next(err, req, res);
            }
        )(req,res,next);
    }
    async function getProfile(req:any,res:any,next:any) {
        if (options.onProfile)
            return options.onProfile(req.user);
        return req.user;
    }
    async function handleLogin (req:any, res:any, next:any) {
        try {
            if (DEBUG("jwt")) console.log(req.body);
            if (!req.body) throw new Error(`${req.headers.referer||'(no referer)'} tried to login with no credentials...`);
            if (DEBUG("jwt")) console.info(`🔑  ${req.body.username} logging in...`);
            let validUser;
            if (options.onLogin) validUser = await options.onLogin(req.body.username, req.body.password);
            if (!validUser) {
                throw new Error(`Invalid password for user ${req.body.username}`);
            }
            else setJwt(validUser);
        } catch (e) {
            let failure = `❌  👤  Login failed ${req&&req.body?('for '+req.body.username):''}:`;
            console.error(failure);
            console.error(e)
            if(!e.status) e.status = 401;
            next(e);
        }
        
        function setJwt(user:any) {
            const S = 1000, M = 60 * S, H = 60 * M, maxAgeMs = (
                parseInt(options.expiryHours as string) * H
            ) + (
                parseInt(options.expiryMinutes as string) * M
            ),
            expiryStamp = new Date().valueOf() + maxAgeMs;
            try {
                var token = sign(user.name, {roles:user.roles});
                res.writeHead(200, {
                    'Set-Cookie':options.headerName+'='+token
                        +`;Expires=${expiryStamp};Max-Age=${maxAgeMs};path=/;httponly;`,
                    'Content-Type':'application/json; charset=utf-8;'
                });
                res.write(Buffer.from(JSON.stringify(user)));
                res.end();
                if (DEBUG("jwt")) console.info(`☑️  ${JSON.stringify(user)} is logged in...`);
            }
            catch (e) {
                console.error(`❌  👤  Can't write a session for ${JSON.stringify(user)} (${e})`);
            }
            function sign(sub:string|any, payload?: object|any) {
                if (!payload) payload = {};
                payload.sub = sub.toString();
                payload.iss = options.host;
                payload.aud = options.audience;
                payload.exp = expiryStamp / S;
                return Jwt.sign(payload,
                    options.secret as any
                );
            }
        }
    }
    async function handleLogout(req:any, res:any, next:any) {
        if (DEBUG("jwt")) console.info(`👤  🚪  ${req.user.sub} logged out...`);
        try {
            if (options.onLogout) options.onLogout(req.user.sub);
            res.writeHead(204, {'Set-Cookie':options.headerName+'=;Expires='+new Date(0)+';Max-Age=0;path=/;httponly'});
            res.end();
        }
        catch (e) {
            console.log(e);
        }
        return req.user;
    }
    return app;
}