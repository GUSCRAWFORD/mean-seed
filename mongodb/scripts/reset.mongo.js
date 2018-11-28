load(`${pwd()}/local-settings.mongo.js`);

Object.keys(APP_DBS).forEach( appDbName=>printReset(appDbName, db[appDbName]) );
function resetDb(dbName) {
    printReset(
        dbName,
        db[dbName].dropDatabase()
    );
}
function printReset(dbName, dropCommandResult) {
    print(`🗑  "${dbName}" was reset:\n\t${JSON.stringify(dropCommandResult)}\n\t${TS()}`);
}