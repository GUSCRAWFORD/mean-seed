load(`${pwd()}/scripts/create-drop-user.mongo.js`);

auth[ADMIN_TYPE]();
Object.keys(APP_DBS).forEach(appDbName=>{
    print(`♻️  Resetting users for ${appDbName}`);
    //print(`♻️  Resetting users for app`);
    dropUser(null, APP_DBS[appDbName], appDbName);
    //dropUser(null, APP_DBS['app'], 'app');
    createUser(null, APP_DBS[appDbName], APP_USERS[APP_DBS[appDbName]], appDbName);
    //createUser(null, APP_DBS['app'], APP_USERS[APP_DBS['app']], 'app');
});
