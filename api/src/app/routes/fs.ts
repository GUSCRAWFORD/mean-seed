import { RouteFactory } from '../config/route.config';
import { File } from '../services/files/files-service';
import { JwtService, DEFAULT_SESSION_HEADER } from '../config/session-jwt.config';
const sessionProtection = JwtService.intance.session[DEFAULT_SESSION_HEADER];
sessionProtection.protect(
  `^/fs.*`
);
export const route = new RouteFactory(
  '/fs',
   {
    '/?:path':{
      get: async function(req, res, next) {
        console.info(req.params.path||'')
        let file = new File(req.params.path||''), result;
        try {
          result = await file.ls();
          if(result) return result;
        } catch(e) {
          try {
            res.type('application/json');
            file.pipe(res);
          } catch(e) {

          }
        }
        return null;
      }
    }
  },
  sessionProtection
);
export { RouteFactory };