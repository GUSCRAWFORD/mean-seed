load(`${pwd()}/scripts/create-drop-user.mongo.js`);
dropUser(ADMIN_TYPE, DB_ADMIN, ADMIN_TYPE);
createUser(ADMIN_TYPE, DB_ADMIN, DB_ADMIN_PWD, ADMIN_TYPE);
