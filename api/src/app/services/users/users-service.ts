import { ODataV4MongoDbGenericRepo } from '@jyv/mongo';
import { Connections } from '../connections.config';
import { HashesService, HashEntry } from '../hashes/hashes-service';
import { CommonQueries } from '../common-queries';
import { User, SystemUser } from '../../../../../models/src';
SystemUser.defaultUsername = process.env.SYSTEM_USER || SystemUser.defaultUsername;
export class UserSession {
    constructor(
        public user:User
    ) {}
    start = new Date();
}
export class UsersService extends ODataV4MongoDbGenericRepo<User> {
    static instance = new UsersService( );
    static defaultSecret = process.env.APP_USER_HASH_SECRET || 'hard-coded-secret';
    sessions: {[key:string]: UserSession} = {};
    hashes: { [key:string]: string } = {};
    constructor(public secret:string='') {
        super('users', Connections.app);
        this.secret = secret || UsersService.defaultSecret;
    }
    async validate (username, password) : Promise<boolean> {
        if (UsersService.system && username === SystemUser.defaultUsername) {
            var systemUser, systemHashedPassword;
            try {
                systemUser = await UsersService.system;
                systemHashedPassword = await HashesService.instance.hash(password, UsersService.defaultSecret);
            } catch (e) {
                console.error(e);
            }
            if(systemUser.passwordHash === systemHashedPassword) {
                this.hashes[systemHashedPassword] = username;
                return true;
            }
            return false;
        }
        var hashEntry = (await HashesService.instance.query(CommonQueries.userHash(username))).pop();
        if (!hashEntry) return false;
        var verificationHash = await HashesService.instance.hash(password, UsersService.instance.secret);
        if (verificationHash === hashEntry.hash) {
            this.hashes[verificationHash] = username;
            return true;
        }
        return false;
    }
    async profile(username) {
        if (UsersService.instance.sessions[username])
            return UsersService.instance.sessions[username].user;
        var profile : User = (
            await this.query(CommonQueries.userProfile(username))
        ).pop() as User;
    }
    async login (username, password) {
        var inst = this, valid = await this.validate(username, password), profile;
        if (valid) {
            profile = await inst.profile(username);
            inst.sessions[username] = new UserSession(profile);
            return profile;
        }
        throw new Error(`AUTH_FAIL`);
    }
    async logout(username) {
        var profile = this.sessions[username]
        if (profile)
            delete this.sessions[username];
        return profile;
    }
    static system = process.env.SYSTEM_PASSWORD
        ? new Promise<SystemUser>(
            (resolve,reject)=>
                UsersService.instance.sessions[SystemUser.defaultUsername]
                ?
                    resolve(UsersService.instance.sessions[SystemUser.defaultUsername].user)
                :   HashesService.instance.hash(process.env.SYSTEM_PASSWORD as string, UsersService.defaultSecret)
                        .then(systemUserHash=>{
                            var systemUser = new SystemUser();
                            systemUser.passwordHash = systemUserHash;
                            UsersService.instance.sessions[systemUser.username] = new UserSession(systemUser);
                            UsersService.instance.hashes[systemUserHash] = systemUser.username;
                            return resolve(systemUser);
                        }).catch(err=>reject(err))
        )
        :null;
}