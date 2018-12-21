import { RouteFactory } from '../config/route.config';
import { UsersService } from '../services/users/users-service';
import { JwtService } from '../config/session-jwt.config';
const sessionProtection = JwtService.intance.session[process.env.SESSION_HEADER as string];
sessionProtection.protect(
  `/users/`
);
export const router = new RouteFactory(
  '/users',
    {
    '/':{
      get: async function(req, res, next) {
        return UsersService.instance.query(req.body);
      }
    },
  //   ,
  //   '/login':{
  //     get: async (req, res, next)=>{
  //       var nothing = null;
  //       (nothing as any).something;
  //       return nothing;
  //     }
  //   }
  },
  sessionProtection
);
export { RouteFactory };