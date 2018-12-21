
import 'mocha';
import { equal } from 'assert';
import { MockApp } from '../../mocks';
import { spy } from 'sinon';
import { config as session } from '../../../src/app/config/session-jwt.config';
session(MockApp.instance,{})
import { route } from '../../../src/app/routes/users';
import { UsersService } from '../../../src/app/services/users/users-service';
const USERS_ROUTE = 'users', EXPECTED_QUERY = {}, EXPECTED_KEY = 'x';
describe(`👤  /${USERS_ROUTE}`, ()=>{
    before(function() {
        UsersService.instance.query = spy();
        UsersService.instance.read = spy();
    });
    describe(`GET`, function() {
        it(`called UsersService.instance.query with req.query`, async function () {
            var result;
            try {

                result = await route.routeMap['/'].get({query:EXPECTED_QUERY},{},()=>{});
            }
            catch(e) {
            }
            equal((UsersService.instance.query as any).calledWith(EXPECTED_QUERY), true)
            return result;
        });
        it(`called UsersService.instance.read with :key and req.query`, async function () {
            var result;
            try {

                result = await route.routeMap['/:key'].get({params:{key:EXPECTED_KEY}, query:EXPECTED_QUERY},{},()=>{});
            }
            catch(e) {
            }
            equal((UsersService.instance.read as any).calledWith(EXPECTED_KEY, EXPECTED_QUERY), true)
            return result;
        });
    });
});