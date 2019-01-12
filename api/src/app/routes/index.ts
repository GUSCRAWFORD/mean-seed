import { RouteFactory } from "../config/route.config";

/**
 * Import your routes here...
 */
// import * as users from './users';
const controllers: RouteFactory[] = [
  // users,
];
export const routes = {};
controllers.forEach(controller=>(routes as any)[(controller as any).route.path]=(controller as any).route);
//console.info(routes)