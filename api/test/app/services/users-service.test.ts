
import 'mocha';
import { equal } from 'assert';
//import { MockApp } from '../../mocks';
import { spy } from 'sinon';
//import { config as session } from '../../../src/app/config/session-jwt.config';
//session(MockApp.instance,{})
//import { route } from '../../../src/app/routes/users';
import { UsersService } from '../../../src/app/services/users/users-service';
import { HashesService } from '../../../src/app/services/hashes/hashes-service';
import { SystemUser } from 'models/src';
describe(`👤  UsersService `, ()=>{
    describe(`validate`, function() {
        //let UsersServiceInstance;
        beforeEach(function() {
            HashesService.instance.query = spy(function() {
                return [
                    { hash:'x' }
                ]
            });
            HashesService.instance.compare = spy(function(password, hash){
                if (password==='wrong') return false;
                return true;
            });
        });
        it('returns true with arguments "system" and "pass!"', async function () {
            //console.info(UsersService.system)
            equal(await UsersService.instance.validate('system','pass!'), true);
        });
        it('returns false with arguments "system" and "wrong"', async function () {
            //console.info(UsersService.system)
            equal(await UsersService.instance.validate('system','wrong'), false);
        });
        it('returns true with arguments "user" and "pass!"', async function () {
            equal(await UsersService.instance.validate("user","pass!"), true)
        });
        it('returns false with arguments "user" and "wrong"', async function () {
            equal(await UsersService.instance.validate("user","wrong"), false)
        });
    });
    describe('profile', function() {
        it('returns the existing user from session', async function () {
            equal(await UsersService.instance.profile("system"), UsersService.instance.sessions.system.user);
        })
    });
});