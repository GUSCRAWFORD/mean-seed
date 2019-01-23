

// https://cloud.google.com/nodejs/getting-started/authenticate-users
import { DEBUG } from '../services/debug';
import { SessionConfigOptions, Protection } from './session.config';
import { GET_PROFILE_FACTORY, HANDLE_LOGIN_FACTORY, HANDLE_LOGOUT_FACTORY, AUTHENTICATE_FACTORY, VALID_OAUTH2 } from '../services/session-gapps';
import { Passport, Authenticator } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Handler } from 'express';
export * from './session.config';
export class GAppsService {
    static intance = new GAppsService();
    session:{
        [key:string]:GAppsProtection
    } = {};
}
export class GAppsProtection extends Protection {
    constructor(
        paths:{[key:string]:(req:any,res:any,next:any)=>Promise<any>}={},
        authenticate:(req:any,res:any,next:any)=>Promise<any>
    ) {
        super (paths, authenticate);
    }
}
export class GAppsSessionConfigOptions extends SessionConfigOptions {
    scope?:string[]=process.env.SESSION_GAPPS_SCOPE&&process.env.SESSION_GAPPS_SCOPE.split(/\s*,\s*/)||['email','profile'];
    loginPath?:string = process.env.SESSION_GAPPS_LOGIN_PATH||'/users/login';
    logoutPath?:string = process.env.SESSION_GAPPS_LOGOUT_PATH||`/users/logout`;
    redirectPath?:string = process.env.SESSION_GAPPS_OAUTH2_CALLBACK||`/users/oauth`;
    onLogin?:(profile:{id:string,displayName:string})=>Promise<any>;
    onLogout?:(username:string)=>Promise<any>;
    onAuthenticate?:(success:any,req:any)=>Promise<any>;
    onFailedAuthenticate?:(error:any,req:any)=>Promise<any>;
    onProfile?:(user:any)=>Promise<any>;
}

export function extractProfile (profile) {
    let imageUrl = '';
    if (profile.photos && profile.photos.length) {
        imageUrl = profile.photos[0].value;
    }
    return {
        id: profile.id,
        displayName: profile.displayName,
        image: imageUrl
    };
}
/**
 * 
 * @param app
 */
export function config(
    app:any,
    options: GAppsSessionConfigOptions
) {
    const PASSPORT = new Passport();
    options = Object.assign(new GAppsSessionConfigOptions(),options);
    PASSPORT.use(
        new GoogleStrategy(
            {
                clientID: process.env.SESSION_GAPPS_CLIENT_ID,
                clientSecret: process.env.SESSION_GAPPS_CLIENT_SECRET,
                callbackURL: process.env.SESSION_GAPPS_OAUTH2_CALLBACK,
                accessType: 'offline'
            },
            //(req:any, decodedJwt:any, done:any)
            (
                accessToken:any,
                refreshToken:any,
                profile:any,
                done:(err:any,extractedProfile:any)=>any
            )=>{
                //console.info(req);
                if (DEBUG("gapps-oauth")) {
                    console.info(`🔑  👤  Authenticating request:`);
                    console.log(profile);
                }
                return done(null, extractProfile(profile));
            }
        )
    );
    GAppsService.intance.session[options.headerName as string] = new GAppsProtection({ /** other paths? */ }, AUTHENTICATE_FACTORY(options, PASSPORT as any));
    mapRoutes(app, options, PASSPORT);
    configSerialization(PASSPORT);
    return app;
}
function configSerialization(PASSPORT: any) {
    PASSPORT.serializeUser((user, callback)=>{
        callback(null, user);
    });
    PASSPORT.deserializeUser((obj, callback)=>{
        callback(null, obj);
    });
}
function mapRoutes (app:any, options: GAppsSessionConfigOptions, PASSPORT: any) {
    app.get(`${options.loginPath}`, AUTHENTICATE_FACTORY(options, PASSPORT), HANDLE_LOGIN_FACTORY(options));
    app.post(`${options.loginPath}`, AUTHENTICATE_FACTORY(options, PASSPORT), GET_PROFILE_FACTORY(options));
    app.get(`${options.logoutPath}`, AUTHENTICATE_FACTORY(options, PASSPORT), HANDLE_LOGOUT_FACTORY(options));
    app.post(`${options.logoutPath}`, AUTHENTICATE_FACTORY(options, PASSPORT), HANDLE_LOGOUT_FACTORY(options));
    app.put(`${options.logoutPath}`, AUTHENTICATE_FACTORY(options, PASSPORT), HANDLE_LOGOUT_FACTORY(options));
    app.get(`${options.redirectPath}`, AUTHENTICATE_FACTORY(options, PASSPORT), VALID_OAUTH2(options));
}