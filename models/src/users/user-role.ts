export class UserRole {
    constructor(
        public id:any,
        public name:string
    ) {
        this.name = name || "";
        this.id = id || ""
    }
};
export const
SuperUserRole = new UserRole(1000, "super"),
UserRoles = {
    get Super() { return SuperUserRole; }
};