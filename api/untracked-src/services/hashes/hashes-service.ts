import { ODataV4MongoDbGenericRepo } from '@jyv/mongo';
import { Connections } from '../services/connections.config';
import * as bcrypt from 'bcrypt';
export class HashEntry {
    key:string = '';
    hash:string = '';
};
/**
 * Manage a table of hashes for many purposes
 */
export class HashesService extends ODataV4MongoDbGenericRepo<HashEntry> {
    static instance = new HashesService( );
    constructor( ) {
        super('hashes', Connections.app)
    }
    /**
     * 
     * @param data 
     * @param secret 
     */
    async hash(data:string, secret:string) {
        return new Promise((done, error)=>{
            bcrypt.hash(data, 10, (err,hash)=>err?error(err):done(hash as string))
        });
    }
    async compare(password:string, hash:string) {
        return new Promise((done, error)=>{
            bcrypt.compare(password, hash, (err, result)=>err?error(err):done(result as boolean));
        })
    }
}