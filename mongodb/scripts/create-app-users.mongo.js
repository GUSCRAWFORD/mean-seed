load(`${pwd()}/scripts/create-user.mongo.js`);

Object.keys(APP_DBS).forEach(appDbName=>{
    dropUser(APP_DBS[appDbName], appDbName);
    createUser(null, APP_DBS[appDbName], APP_USERS[APP_DBS[appDbName]], appDbName);
})
