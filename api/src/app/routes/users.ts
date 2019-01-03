import { RouteFactory } from '../config/route.config';
import { UsersService } from '../services/users/users-service';
import { JwtService, DEFAULT_SESSION_HEADER } from '../config/session-jwt.config';
const sessionProtection = JwtService.intance.session[DEFAULT_SESSION_HEADER];
sessionProtection.protect(
  `^/users.*`
);
export const route = new RouteFactory(
  '/users',
    {
    '/':{
      get: async function(req, res, next) {
        return UsersService.instance.query(req.query);
      }
    },
    '/:key':{
      get: async function (req, res, next) {
        return UsersService.instance.read(req.params.key, req.query);
      }
    }
  },
  sessionProtection
);
export { RouteFactory };