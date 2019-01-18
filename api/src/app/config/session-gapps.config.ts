

// https://cloud.google.com/nodejs/getting-started/authenticate-users
import { DEBUG } from '../services/debug';
import { SessionConfigOptions, Protection } from './session.config';
import { GET_PROFILE_FACTORY, HANDLE_LOGIN_FACTORY, HANDLE_LOGOUT_FACTORY, AUTHENTICATE_FACTORY } from '../services/session-gapps';
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
    //algorithms?:string[] = process.env.SESSION_JWT_ALGORITHMS && process.env.SESSION_JWT_ALGORITHMS.split(',')||['HS256']
    //audience?:string = process.env.SESSION_JWT_AUDIENCE || this.host;
    //issuer?:string = process.env.SESSION_JWT_ISSUER || this.host;
    loginPath?:string = process.env.SESSION_JWT_LOGIN_PATH||'/users/login';
    logoutPath?:string = process.env.SESSION_JWT_LOGOUT_PATH||`/users/logout`;
    onLogin?:(username:string,password:string)=>Promise<any>;
    onLogout?:(username:string)=>Promise<any>;
    onAuthenticate?:(success:any,req:any)=>Promise<any>;
    onFailedAuthenticate?:(error:any,req:any)=>Promise<any>;
    onProfile?:(user:any)=>Promise<any>;
    //sign?:(sub:string, payload:any)=>any;
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
                passReqToCallback:true,
                secretOrKey: options.secret,

                clientID: process.env.G_APPS_CLIENT_ID,
                clientSecret: process.env.G_APPS_CLIENT_SECRET,
                callbackURL: process.env.G_APPS_OAUTH2_CALLBACK,
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
    return app;
}
function mapRoutes (app:any, options: GAppsSessionConfigOptions, PASSPORT: any) {
    app.post(`${options.loginPath}`, HANDLE_LOGIN_FACTORY(options));
    app.get(`${options.loginPath}`, AUTHENTICATE_FACTORY(options, PASSPORT), GET_PROFILE_FACTORY(options));
    app.get(`${options.logoutPath}`, AUTHENTICATE_FACTORY(options, PASSPORT), HANDLE_LOGOUT_FACTORY(options));
    app.post(`${options.logoutPath}`, AUTHENTICATE_FACTORY(options, PASSPORT), HANDLE_LOGOUT_FACTORY(options));
    app.put(`${options.logoutPath}`, AUTHENTICATE_FACTORY(options, PASSPORT), HANDLE_LOGOUT_FACTORY(options));
}


export function configX(router, passport, ProfilesController) {
    // Login
    // https://cloud.google.com/nodejs/getting-started/authenticate-users
    router.get(
        // Login url
        '/login',
    
        // Save the url of the user's current page so the app can redirect back to
        // it after authorization
        async (req, res, next) => {
        if (req.query.return) {
            (req as any).session.oauth2return = req.query.return;
        }
        next();
        },
    
        // Start OAuth 2 flow using Passport.js
        passport.authenticate('google', { scope: ['email', 'profile'] })
    );
    // OAuth Redirect
    router.get(
        // OAuth 2 callback url. Use this url to configure your OAuth client in the
        // Google Developers console
        '/oauth2',
    
        // Finish OAuth 2 flow using Passport.js
        passport.authenticate('google', { scope: ['email', 'profile'] }),
    
        // Redirect back to the original page, if any
        async (req:any&{user:any}, res, next) => {
        const redirect = (req as any).session.oauth2return || '/';
        delete (req as any).session.oauth2return;
        try {
            if (req.user) {
            var profileName = `${req.user.id}-${req.user.displayName}`,
                existingProfile = await ProfilesController.instance.read(profileName);
            if (!existingProfile) await ProfilesController.instance.create({
                name:profileName,
                roles:[1]
            });
            }
        res.redirect(redirect);
        }
        catch (ex) {
            console.error(ex);
            next(ex);
        }
        }
    );
    router.get('/logout', (req, res) => {
        (req as any).logout();
        res.redirect('/');
    });
    
    router.get('/me', (req, res, next)=>{
        res.json((req as any).user || {});
    });
}