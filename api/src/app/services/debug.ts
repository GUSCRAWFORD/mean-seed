export const DEBUG = (topic:string)=>
    process.env.DEBUG && (
        process.env.DEBUG==='*'
            || process.env.DEBUG.split(',').find(t=>t===topic)
    );
export class Sequence {
    constructor(
        private name='',
        private labels:string[]=[`1️⃣`,`2️⃣`,`2️⃣`,`4️⃣`,`5️⃣`,`6️⃣`,`7️⃣`,`8️⃣`,`9️⃣`,`🔟`,`*️⃣`]
    ) {
        if (name) Sequence.named[name] = this;
    }
    static named:{[key:string]:Sequence} = {};
    static empty(name?:string) {
        if (name)
            delete Sequence.named[name];
        Sequence.named = {};
    }
    static $(name:string, labels:string[]=[`1️⃣`,`2️⃣`,`2️⃣`,`4️⃣`,`5️⃣`,`6️⃣`,`7️⃣`,`8️⃣`,`9️⃣`,`🔟`,`*️⃣`]) {
        return Sequence.named[name] || new Sequence(name, labels)
    }
    private step = 0;
    get label() {
        return this.labels[this.step>=this.labels.length?this.step++:this.step];
    }
}