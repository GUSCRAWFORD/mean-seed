import { ODataV4MongoDbGenericRepo } from '@jyv/mongo';
import { Connections } from '../connections.config';
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
        return data+secret;
    }
}