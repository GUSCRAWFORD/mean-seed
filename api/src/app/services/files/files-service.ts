import { join } from 'path';
import { InMemoryService } from '../in-memory';
import { readFile, readdir, createReadStream } from 'fs';
export class FilesService  extends InMemoryService{
    static instance = new FilesService();
    static rootDirectory = join(process.cwd(), process.env.FS_ROOT_DIR || 'private')
    constructor () {
        super();
    }
}
export class File {
    constructor(
        public path: string
    ) {}
    stream:any=null;
    cachedFile(path:string,done?:any) {
        if (FilesService.instance.cache(path)) {
            if (typeof done === 'function')
                return done(FilesService.instance.cache(path));
            else return true;
        }
        return null;
    }
    pipe(dest:any) {
        this.stream = createReadStream(join(this.path.startsWith(process.cwd())?'':FilesService.rootDirectory, this.path));
        return this.stream.pipe(dest);
    }
    close() {
        this.stream&&this.stream.close();
        return true;
    }
    async cat(cache:boolean=true) : Promise<InMemoryFile> {
        return new Promise<InMemoryFile>(
            (done,error)=>{
                if(this.cachedFile(this.path, done)&&cache)
                    return FilesService.instance.cache(this.path);
                readFile(join(this.path.startsWith(process.cwd())?'':FilesService.rootDirectory, this.path), (err, data)=>{
                    if (err) error(err);
                    else {
                        var conts = new InMemoryFile(this.path, data);
                        if (cache) FilesService.instance.cache(this.path, conts);
                        done(conts);
                    }
                });
            }
        );
    }
    async ls(cache:boolean=true) {
        return new Promise<InMemoryFile> (
            (done, error)=>{
                if (FilesService.instance.cache(this.path)&&cache)
                    return FilesService.instance.cache(this.path);
                readdir(join(this.path.startsWith(process.cwd())?'':FilesService.rootDirectory, this.path),'utf8',(err, list)=>{
                    if (err) error(err);
                    else {
                        var listing = new InMemoryFile(this.path, list);
                        if (cache) FilesService.instance.cache(this.path, listing)
                        done(listing);
                    }
                });
            }
        )
    }
}
export class InMemoryFile extends File {
    constructor(
        public path,
        public content
    ) {
        super(path);
    }
}