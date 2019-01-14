import { RouteFactory } from '../config/route.config';
import { DynamoRepo } from '../services/dynamo';
import { JwtService, DEFAULT_SESSION_HEADER } from '../config/session-jwt.config';
import * as Joi from 'joi';
const sessionProtection = JwtService.intance.session[DEFAULT_SESSION_HEADER];
import { Project } from 'models';
//dynamo.createTables(function(err){console.error(err)});
const repo = new DynamoRepo<Project>('project',{hashKey:'name',timestamps:true, schema:DynamoRepo.inferModel(new Project())},{user:'dev',schema:'docs'});
sessionProtection.protect(
  `^/projects.*`
);
export const route = new RouteFactory(
  '/projects',
   {
    '/':{
        get: async function(req, res, next) {
            
            await repo.init;
            return repo.query();
        },
        put: async function (req) {
            await repo.init;

            return repo.create(req.body);
        }
    }
  },
  sessionProtection
);
export { RouteFactory };
function pipeResult(res, file) {
  try {
    res.type('application/json');
    file.pipe(res);
  } catch(e) {
    console.error(e);
  }
}