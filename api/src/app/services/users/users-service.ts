import { ODataV4MongoDbGenericRepo } from '@jyv/mongo';
import { Connections } from '../connections.config';
import { HashesService, HashEntry } from '../hashes/hashes-service';
import { CommonQueries } from '../common-queries';
//import { User, SystemUser } from '../../../../../models/src';
import { User, SystemUser } from '@private/models';
import { hash } from 'bcrypt';
import { ExpressLikeODataQuery } from '@jyv/core';
SystemUser.defaultUsername = process.env.SYSTEM_USER || SystemUser.defaultUsername;
export class UserSession {
    constructor(
        public user:User
    ) {}
    start = new Date();
    end?:Date;
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
    async seed(users:User[]) {
        return Promise.all(users.map(seededUser=>UsersService.instance.create(seededUser)));
    }
    async create(data:User, context?:any) {
        UsersService.instance.dontSave(data);
        return super.create(data, context);
    }
    async update(query:ExpressLikeODataQuery, data:User, context?:any) {
        UsersService.instance.dontSave(data);
        return super.update(query, data, context);
    }
    async upsert(key:string, data:User, context?:any) {
        UsersService.instance.dontSave(data);
        console.info(data)
        return super.upsert(key, data, context)
    }
    dontSave(user:User) {
        delete user.clearTextPassword;
        delete user.passwordHash;
    }
    async validate (username, password) : Promise<boolean> {
        if (UsersService.system && username === SystemUser.defaultUsername) return this.systemValidate(username, password);
        var hashEntry = (await HashesService.instance.query(CommonQueries.userHash(username))).pop();
        if (!hashEntry) return false;
        //var verificationHash = await HashesService.instance.hash(password, UsersService.instance.secret);
        if (await HashesService.instance.compare(password, hashEntry.hash)) {
            this.hashes[hashEntry.hash] = username;
            return true;
        }
        return false;
    }
    async profile(username) {
        console.info(`👤 fetching "${username}"...`)
        console.info(UsersService.instance.sessions)
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
        var sessionProfile = this.sessions[username];
        sessionProfile.end = new Date();
        if (sessionProfile)
            delete this.sessions[username];
        return sessionProfile.user;
    }
    private async systemValidate(username, password) {
        var systemUser;
        try {
            systemUser = await UsersService.system;
            //systemHashedPassword = await HashesService.instance.hash(password, UsersService.defaultSecret);
        } catch (e) {
            console.error(e);
        }
        if(await HashesService.instance.compare(password, systemUser.passwordHash)) {
            this.hashes[systemUser.passwordHash] = username;
            return true;
        }
        return false;
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
                            systemUser.passwordHash = systemUserHash as string;
                            UsersService.instance.sessions[systemUser.username] = new UserSession(systemUser);
                            UsersService.instance.hashes[systemUserHash as string] = systemUser.username;
                            return resolve(systemUser);
                        }).catch(err=>reject(err))
        )
        :null;
}