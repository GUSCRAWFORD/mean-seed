import { join } from 'path';
import { TS } from '../../timestamp'
import { File, InMemoryFile } from '../files/files-service';
export class TranslateService {
    static instance = new TranslateService();
    constructor () {}
    static translations:{
        [key: string]:string&{pluralize:(count:any,str:string)=>string}
    } = {};
    static async init(languages:string[]) {
        var loading:Promise<InMemoryFile>[] = [];
        console.info(`🈂️  Loading translations: ${languages}`)
        languages.forEach(lang=>{
            let translationFilename = join(__dirname,'..','..','..','..','translations',`${lang}.json`);
            loading.push(new File(translationFilename).load()
                .catch(x=>{throw new Error (`Cannot load translation file: ${translationFilename}`)})
                .then(done=>{
                    console.info(`\t${done.path}`);
                    TranslateService.translations[lang]=JSON.parse(done.content);
                    TranslateService.translations[lang].pluralize = pluralizeFactory(lang)
                    return done;
                })
            )
        });
        return Promise.all(loading).then(done=>console.info(`✅  ${languages.length} ${TranslateService.translations.en.pluralize(languages.length, 'language')} loaded:\n\t${TS()}`)).catch(x=>{throw new Error (`Cannot load translation files:`)})
    }
    static capitalize(a:string) {
        return `${a.charAt(0).toLocaleUpperCase()}${a.slice(1)}`;
    }
    static pluralize(a:string) {

    }
}
function pluralizeFactory(lang) {
    const pluralize = {
        en:(count:any, str:string)=>
            !!(count-1)
            ?str.endsWith('s')
                ?str+'es'
                :str.endsWith('y')
                    ?str.slice(0, str.length-2)+'ies'
                    :str+'s'
            :str
    }
    return pluralize[lang];
}