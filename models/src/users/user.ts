import { UserRole, SuperUserRole } from './user-role';
export class User {
    username: string = '';
    roles: UserRole[] = [];
    clearTextPassword?:string;
    passwordHash?:string;
}
export class SystemUser extends User {
    static defaultUsername = 'system';
    username:string = SystemUser.defaultUsername;
    roles = [SuperUserRole];
}