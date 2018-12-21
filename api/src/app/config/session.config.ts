
export class SessionConfigOptions {
    headerName?:string = process.env.SESSION_HEADER || 'x-token';
    host?:string = process.env.HOST || 'localhost:3000';
    expiryHours?:string = process.env.SESSION_EXPIRY_HOURS||'2';
    expiryMinutes?:string = process.env.SESSION_EXPIRY_MINUTES||'5';
    sessionConfigs?:Array<(...any:any[])=>any>=[];
    secret?:string = process.env.SESSION_SECRET || 'hardcoded-secret'
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
        return this.paths[path];
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