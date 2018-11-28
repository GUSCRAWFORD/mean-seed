load(`${pwd()}/scripts/create-user.mongo.js`);
dropUser(DB_ADMIN, ADMIN_TYPE);
createUser(ADMIN_TYPE, DB_ADMIN, DB_ADMIN_PWD, ADMIN_TYPE);
