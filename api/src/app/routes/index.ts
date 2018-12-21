import * as users from './users';
const controllers = [
  users
];
export const routes = {};
controllers.forEach(controller=>routes[controller.route.path]=controller.route);
//console.info(routes)