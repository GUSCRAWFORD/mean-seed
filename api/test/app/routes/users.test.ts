
import { describe, it, afterEach } from 'mocha';
import { equal } from 'assert';

import '../../../src/www';
import { routes } from '../../../src/app/routes';
describe(`👤  User routes /users`, ()=>{
    describe(`GET`, ()=>{
        console.info(routes);
        it('works',()=>{

            equal('x','x');
        });
        it('no works',()=>{

            equal('x','y');


        });
    });
    afterEach(()=>{
    })
});