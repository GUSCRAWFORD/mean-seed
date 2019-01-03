export class InMemoryService {
    cached : { [key:string]:any } = {};
    cache (key:string, data?:any) {
        if (data) {
            this.cached[key] = data;
        }
        return this.cached[key];
    }
}