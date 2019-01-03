
/**
 * Tie your middleware together in this root process start configuration:
 */
import { config as routes} from './route.config';     // Configure and map all control-routes
import { config as errors } from './errors.config';   // Configure errors for other client Accept headers
import { config as session} from './session.config';  // Configure session fundamentals
import { config as jwt } from './session-jwt.config'; // Configure jwt specifics
const createError = require('http-errors');
/**
 * Import singletons needed to control middleware
 */
import { TranslateService } from '../services/index';
import { UsersService } from '../services/users/users-service';
TranslateService.init(['en']);

export const config = function (app) {
  /**
   * Config services
   */
  UsersService.instance
  session(app,{ // Run top-level session configurations
    sessionConfigs:[
      ()=>jwt(app, {  // Configure specific session providers and types
        /** pass config options here */
        onLogin:(username, password)=>UsersService.instance.login(username, password),
        onLogout:(username)=>UsersService.instance.logout(username),
        onProfile:(user)=>UsersService.instance.profile(user.username)
      })
    ]
  });
  routes(app);
  errors(app); // Run error config for application
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

}