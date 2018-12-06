const mongo = new Mongo(),
ADMIN_TYPE      = "admin",
DB_ADMIN        = "admin",
DB_ADMIN_PWD    = "!admin",
DB_ADMIN_AUTH   = "admin",
APP_DBS = {
    "app":"app-user"
},
APP_USERS = {
    "app-user":"!app-user"
},
APP_INDICES = {
    "app":{
        "users":"username"
    }
},
TS = ()=>`🕓  ${new Date().toLocaleString('en-US')}`

db = {
    admin: mongo.getDB('admin')
},
auth = {
    factory : (dbName, admin)=>()=>{
        print(
            `🔑  Authenticating with ${admin?ADMIN_TYPE:APP_DBS[dbName]}: `
            + (db[dbName].auth(admin?ADMIN_TYPE:APP_DBS[dbName], admin?DB_ADMIN_PWD:APP_USERS[APP_DBS[dbName]])?`✅`:`❌`)
            + `\n\t${TS()}`
        );
    }
};
auth.admin = auth.factory(ADMIN_TYPE, true);
Object.keys(APP_DBS).forEach( appDbName=>{
    db[appDbName] = mongo.getDB(appDbName);
    if (AUTH) auth[appDbName] = auth.factory(appDbName);
} );