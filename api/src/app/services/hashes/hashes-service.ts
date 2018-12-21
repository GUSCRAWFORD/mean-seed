import { ODataV4MongoDbGenericRepo } from '@jyv/mongo';
import { Connections } from '../connections.config';
export class HashEntry {
    key:string = '';
    hash:string = '';
};
export class HashesService extends ODataV4MongoDbGenericRepo<HashEntry> {
    static instance = new HashesService( );
    constructor( ) {
        super('hashes', Connections.app)
    }
    async hash(data:string, secret:string) {
        return data+secret;
    }
}