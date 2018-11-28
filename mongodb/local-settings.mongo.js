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
};

Object.keys(APP_DBS).forEach( appDbName=>{
    db[appDbName] = mongo.getDB(appDbName);
    if (AUTH) db[appDbName].auth(APP_DBS[appDbName], APP_USERS[APP_DBS[appDbName]]);
} );