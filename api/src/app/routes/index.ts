import * as users from './users';
const controllers = [
  users
];
export const routes = {};
controllers.forEach(controller=>routes[controller.router.path]=controller.router);
//console.info(routes)