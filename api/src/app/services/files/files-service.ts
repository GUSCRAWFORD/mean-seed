import { join } from 'path';
import { readFile } from 'fs';
export class FilesService {
    static instance = new FilesService();
    constructor () {}
    static cached = {};
}
export class File {
    constructor(
        public path: string
    ) {}
    async load() : Promise<InMemoryFile> {
        return new Promise<InMemoryFile>(
            (done,error)=>{
                if (FilesService.cached[this.path])
                    return done(FilesService.cached[this.path]);
                readFile(this.path, (err, data)=>{
                    if (err) error(err);
                    else {
                        FilesService.cached[this.path] = new InMemoryFile(this.path, data)
                        done(FilesService.cached[this.path]);
                    }
                });
            }
        );
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