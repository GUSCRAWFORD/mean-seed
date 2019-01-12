import { RouteFactory } from '../../src/app/config/route.config';
import { JwtService, DEFAULT_SESSION_HEADER } from '../../src/app/config/session-jwt.config';
const sessionProtection = JwtService.intance.session[DEFAULT_SESSION_HEADER];
sessionProtection.protect(
  `^/users.*`
);
export class User {
  static set:User[] = [];
  username = 'default';
  constructor( public id:string ) {
    this.id = id || (User.set.push(this)-1).toString();
  }
}
export const route = new RouteFactory(
  '/users',
    {
    '/':{
      get: async function(req) {
        return User.set.filter(
          user=>Object.keys(user).filter(prop=>req.query[prop]==(user as any)[prop])
        );
      },
      delete: async ()=>
        0
    },
    '/:key':{
      get: async function () {
        return {username:'default'};
      }
    },
    '/seed':{
      post: async (req, res, next)=> req.body instanceof Array?User.set.splice(req.body,0):next(`array expected, got: ${req.body}`)
    }
  },
  sessionProtection
);
export { RouteFactory };