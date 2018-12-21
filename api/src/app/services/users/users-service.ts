import { ODataV4MongoDbGenericRepo } from '@jyv/mongo';
import { Connections } from '../connections.config';
import { HashesService, HashEntry } from '../hashes/hashes-service';
import { CommonQueries } from '../common-queries';
import { User } from 'models/src';
export class UserSession {

}
export class UsersService extends ODataV4MongoDbGenericRepo<User> {
    static instance = new UsersService( );
    static sessions: {[key:string]: UserSession};
    constructor( ) {
        super('users', Connections.app)
    }
    async validate (username, password) : Promise<boolean> {
        var hashEntry = (await HashesService.instance.query(CommonQueries.userHash(username))).pop();
        if (!hashEntry) return false;
        var verificationHash = await HashesService.instance.hash(password, process.env.APP_USER_HASH_SECRET || 'hard-coded-secret');
        return verificationHash === hashEntry.hash;
    }
    async profile(username) {
        var profile : User = (
            await UsersService.instance.query(CommonQueries.userProfile(username))
        ).pop() as User;
        UsersService.sessions[profile.username] = profile;
    }
    async login (username, password) {
        var valid = await this.validate(username, password);
        if (valid) return this.profile(username);
        throw new Error(`AUTH_FAIL`);
    }
    async logout(username) {
        var profile = UsersService.sessions[username]
        if (profile)
            delete UsersService.sessions[username];
        return profile;
    }
}