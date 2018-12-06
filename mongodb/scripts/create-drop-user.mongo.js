load(`${pwd()}/local-settings.mongo.js`);

function createUser(type, user, password, authDbName) {
    printCreateUser(
        type,
        user,
        db[authDbName].createUser({
            user:user,
            pwd:password,
            roles:[
                { role: "readWrite", db: authDbName }
            ].concat(type===ADMIN_TYPE?[
                { role: "dbAdmin", db: authDbName },
                { role: "userAdminAnyDatabase", db: authDbName }
            ]:[])
        })
    );
}
function dropUser(type, user, authDbName) {
    //print(Object.keys(db));
    //print(ADMIN_TYPE)
    printDropUser(type, user, db[authDbName].dropUser(user));
}
function printCreateUser(type, user, createCommandResult) {
    print(`${type===ADMIN_TYPE?'🔐 ':''}👤  Created ${type===ADMIN_TYPE?'(admin)':''} db user "${user}": ✅\n\t${TS()}`)
}
function printDropUser(type, user, dropCommandResult) {
    print(`🗑  ${type===ADMIN_TYPE?'🔐 ':''}👤  Dropped ${type===ADMIN_TYPE?'(admin)':''} db user "${user}": ${dropCommandResult?'✅':'❌'}\n\t${TS()}`)
}