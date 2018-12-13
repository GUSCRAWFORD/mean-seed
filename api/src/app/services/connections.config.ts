import { ConnectionInfo } from "@jyv/core";

export class Connections  {
    static app: ConnectionInfo& { 'app-user':string } = {
        schema: process.env.APP_DB || 'app',
        user: process.env.APP_DB_USER || 'app-user',
        pwd: process.env.APP_DB_USER_PASSWORD || '!app-user',
        'app-user': process.env.APP_DB_USER_PASSWORD || '!app-user',
        host: process.env.APP_DB_HOST || 'localhost',
        port: parseInt(process.env.APP_DB_PORT as string) || 27017
    };
}