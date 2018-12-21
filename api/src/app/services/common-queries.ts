import { ExpressLikeODataQuery } from '@jyv/core';
export class CommonQueries {
    static userHash (username) {
        return {
            $filter:`key eq '${username}'`,
            $top:`1`
        }
    }
    static userProfile(username) {
        return {
            $filter:`username eq ${username}`,
            $top:'1'
        }
    }
}