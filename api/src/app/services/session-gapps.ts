import { UNAUTHORIZED, OK } from 'http-status-codes';
import { DEBUG } from './debug';
import { TS } from './timestamp';
import { Request, Response, Handler } from 'express';
import { GAppsSessionConfigOptions } from '../config/session-gapps.config';
import { Authenticator } from 'passport';
const LOGIN_NO_CREDS = (req:Request) => `${req.headers.referer||'(no referer)'} tried to login with no credentials...`,
LOGIN_FAILED = (req:Request) => `❌  👤  Login failed ${req&&req.body?('for '+req.body.username):''}:`,
DEBUG_TOPIC = 'gapps-oauth';
export const GET_PROFILE_FACTORY = (options:GAppsSessionConfigOptions) => async function getProfile(req:any,res:any,next:any) {
    let profile: any = req.user;
    if (options.onProfile)
        profile = await options.onProfile(req.user);
    res.json(profile);
    return req.user;
}
export const HANDLE_LOGIN_FACTORY = (options:GAppsSessionConfigOptions) => async function handleLogin (req:any, res:any, next:any) {
    try {
        if (req.query.return) {
            (req as any).session.oauth2return = req.query.return;
        }
        if (DEBUG(DEBUG_TOPIC)) console.info(`🔑  GApps OAuth user logging in...`);
        next(req, res, null);
    } catch (e) {
        HANDLE_LOGIN_ERROR(e, req, next);
    }
}
export const HANDLE_LOGIN_ERROR = (e:any, req:Request, next:(args?:any)=>any)=> {
    console.error(LOGIN_FAILED(req));
    console.error(e)
    if(!e.status) e.status = UNAUTHORIZED;
    next(e);
}
export const HANDLE_LOGOUT_FACTORY = (options:GAppsSessionConfigOptions) => async function handleLogout(req:any, res:any, next:any) {
    let receipt:any = req.user;
    if (DEBUG(DEBUG_TOPIC)) console.info(`👤  🚪  ${req.user.sub} logged out...`);
    try {
        if (options.onLogout)
            receipt = await options.onLogout(req.user);
        (req as any).logout();
        //res.redirect('/');
    }
    catch (e) {
        console.log(e);
    }
    return req.user;
}
export const VALID_OAUTH2 = async (options:GAppsSessionConfigOptions, req:Request, res:Response)=>{
    const redirect = (req as any).session.oauth2return || '/';
    delete (req as any).session.oauth2return;
    var validUser, profile = req.user||null;
    if (options.onLogin) validUser = await options.onLogin(profile);
    res.redirect(redirect);
    if (!validUser) {
        throw new Error(`Invalid user ${req.body.username}`);
    }
    return validUser;
}
export const AUTHENTICATE_FACTORY = (options:GAppsSessionConfigOptions, PASSPORT:Authenticator<Handler, any, any>) => async function authenticate (req:any,res:any,next:any) {
    return PASSPORT.authenticate(
        "google",
        { scope: ['email','profile'], failWithError: req.app.get('env') === 'development' },
        async (err, success)=>{
            const GENERAL_FAIL = async (err:any)=>{
                if (options.onFailedAuthenticate)
                    await options.onFailedAuthenticate(err, req);
                err.status = UNAUTHORIZED;
                throw err;
            }
            if (DEBUG(DEBUG_TOPIC))
                console.info(`🔑' GApps OAuth: ${JSON.stringify(success)}`);
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
