import { RouteFactory } from '../route.config';
//console.log(RouteFactory)
export const router = new RouteFactory({
  '/':{
    get: async function(req, res, next) {
      res.json({message:'respond with a resource'});
    }
  },
  '/login':{
    get: async (req, res, next)=>{
      var nothing = null;
      (nothing as any).something;
      return nothing;
    }
  }
});