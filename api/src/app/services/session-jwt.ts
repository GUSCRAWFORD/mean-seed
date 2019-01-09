import { UNAUTHORIZED, OK } from 'http-status-codes';
import { DEBUG } from './debug';
import { TS } from './timestamp';
import * as Jwt from 'jsonwebtoken';
const LOGIN_NO_CREDS = (req) => `${req.headers.referer||'(no referer)'} tried to login with no credentials...`,
LOGIN_FAILED = (req) => `❌  👤  Login failed ${req&&req.body?('for '+req.body.username):''}:`;
export const GET_PROFILE_FACTORY = (options) => async function getProfile(req:any,res:any,next:any) {
    let profile: any = req.user;
    if (options.onProfile)
        profile = await options.onProfile(req.user.sub);
    res.json(profile);
    return req.user;
}
export const HANDLE_LOGIN_FACTORY = (options) => async function handleLogin (req:any, res:any, next:any) {
    try {
        //if (DEBUG("jwt")) console.log(req.body);
        if (!req.body) throw new Error(LOGIN_NO_CREDS(req));
        if (DEBUG("jwt")) console.info(`🔑  ${req.body.username} logging in...`);
        let validUser = await VALID_USER(options, req);
        SET_JWT_FACTORY(options, res)(validUser);
    } catch (e) {
        HANDLE_LOGIN_ERROR(e, req, next);
    }
}
export const VALID_USER = async (options, req)=>{
    var validUser
    if (options.onLogin) validUser = await options.onLogin(req.body.username, req.body.password);
    if (!validUser) {
        throw new Error(`Invalid password for user ${req.body.username}`);
    }
    return validUser;
}
export const HANDLE_LOGIN_ERROR = (e, req, next)=> {
    console.error(LOGIN_FAILED(req));
    console.error(e)
    if(!e.status) e.status = UNAUTHORIZED;
    next(e);
}
export const SET_JWT_FACTORY = (options, res)=>function setJwt(user:any) {
    const S = 1000, M = 60 * S, H = 60 * M, maxAgeMs = (
        parseInt(options.expiryHours as string) * H
    ) + (
        parseInt(options.expiryMinutes as string) * M
    ),
    expiryStamp = new Date().valueOf() + maxAgeMs;
    try {
        var token = (options.sign?options.sign:DEFAULT_JWT_SIGN(options, expiryStamp, S))(user.username, {roles:user.roles});
        res.writeHead(OK, {
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

}
export const DEFAULT_JWT_SIGN = (options, expiryStamp, S) => function sign(sub:string|any, payload?: object|any) {
    if (!payload) payload = {};
    payload.sub = sub.toString();
    payload.iss = options.host;
    payload.aud = options.audience;
    payload.exp = expiryStamp / S;
    return Jwt.sign(payload,
        options.secret as any
    );
}
export const HANDLE_LOGOUT_FACTORY = (options) => async function handleLogout(req:any, res:any, next:any) {
    let receipt:any = req.user;
    if (DEBUG("jwt")) console.info(`👤  🚪  ${req.user.sub} logged out...`);
    try {
        if (options.onLogout)
            receipt = await options.onLogout(req.user.sub);
        res.writeHead(OK, {
            'Content-type':'application/json; charset=utf-8;',
            'Set-Cookie':options.headerName+'=;Expires='+new Date(0)+';Max-Age=0;path=/;httponly'
        });
        res.write(Buffer.from(JSON.stringify(receipt)))
        res.end();
    }
    catch (e) {
        console.log(e);
    }
    return req.user;
}

export const AUTHENTICATE_FACTORY = (options, PASSPORT) => async function authenticate (req:any,res:any,next:any) {
    return PASSPORT.authenticate(
        "jwt",
        { session: false, failWithError: req.app.get('env') === 'development' },
        async (err, success)=>{
            const GENERAL_FAIL = async (err:any)=>{
                if (options.onFailedAuthenticate)
                    await options.onFailedAuthenticate(err, req);
                err.status = UNAUTHORIZED;
                throw err;
            }
            if (DEBUG('jwt'))
                console.info(`🔑' JWT: ${JSON.stringify(success)}`);
            if (err) {
                console.error(`🛑 err: ${err}`+TS());
                GENERAL_FAIL(err);
            }
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
