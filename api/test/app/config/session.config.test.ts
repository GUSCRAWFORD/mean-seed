import * as Request from 'request-promise-native';
import { UNAUTHORIZED } from 'http-status-codes';
import { describe, it, afterEach } from 'mocha';
import { equal } from 'assert';

process.env.PORT = '3001';
require('../../../src/www');    // Start the server
import { routes } from '../../../src/app/routes';

const USERS_ROUTE = 'users';
describe(`👤  User routes /${USERS_ROUTE}`, ()=>{
    describe(`GET`, async ()=>{
        //console.info(routes);
        it('works', async ()=>{
            var result;
            try {
                result = await Request.get(`http://localhost:${process.env.PORT}/${USERS_ROUTE}`);
            }
            catch(e) {
                //console.info(JSON.stringify(e));
                equal(e.statusCode, UNAUTHORIZED)
            }
            equal('x','x');
            return result;
        });
        it('no works', async()=>{

            equal('x','y');

            return true;
        });
    });
});
//process.exit(0);