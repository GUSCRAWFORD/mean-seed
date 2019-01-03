import * as users from './users';
import * as fs from './fs';
const controllers = [
  users,
  fs
];
export const routes = {};
controllers.forEach(controller=>routes[controller.route.path]=controller.route);
//console.info(routes)