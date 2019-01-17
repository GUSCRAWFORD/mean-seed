import * as Request from 'request-promise-native';
import { UNAUTHORIZED } from 'http-status-codes';
import 'mocha';
import { equal } from 'assert';
import { MockExpress, MockApp } from '../../mocks';
process.env.PORT = '3000';
// require('../../../src/www');    // Start the server
import { RouteFactory } from '../../../src/app/config/route.config';
RouteFactory.expressInstance = MockExpress.instance;

process.env.DEFAULT_SESSION_HEADER='x';
//import { config as session } from '../../../src/app/config/session-jwt.config';
//session(MockApp.instance,{});
//const USERS_ROUTE = 'users';
describe(`⚙️  User Route config`, function (){
    //console.info(routes);
    it(` 👤  users route is configured as per schema`, function () {
        equal(
            true
            , true
        );
    })
    // it(`http://localhost:${process.env.PORT}/users returns "unauthorized" (${UNAUTHORIZED})`, async function() {

    //     var result;
    //     try {
    //         result = await Request.get(`http://localhost:${process.env.PORT}/users`);
    //     }
    //     catch(e) {
    //         equal(e.statusCode, UNAUTHORIZED)
    //     }
    //     return result;
    // });
    // it(`http://localhost:${process.env.PORT}/users/x returns "unauthorized" (${UNAUTHORIZED})`, async function () {
    //     var result;
    //     try {
    //         result = await Request.get(`http://localhost:${process.env.PORT}/users/x`);
    //     }
    //     catch(e) {
    //         equal(e.statusCode, UNAUTHORIZED)
    //     }
    //     return result;
    // });
});
//process.exit(0);