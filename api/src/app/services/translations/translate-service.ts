import { join } from 'path';
import { TS } from '../timestamp'
import { File, InMemoryFile } from '../files/files-service';
export type TranslationMapFunctionRef = (...arg:string[])=>string;
export type TranslationMap = TranslationMapFunctionRef | string;
export type TranslationEntry = TranslationMap & {
    pluralize:(count:any,str:string)=>string;
};
export class TranslateService {
    static instance = new TranslateService();
    constructor () {}
    static translations:{ [key: string]: TranslationEntry } = {};
    static async init(languages:string[]) {
        var loading:Promise<InMemoryFile>[] = [];
        console.info(`🈂️  Loading translations: ${languages}`)
        languages.forEach(lang=>{
            let translationFilename = join(process.cwd(),'api','translations',`${lang}.json`);
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
        return Promise.all(loading)
            .then(done=>
                console.info(`✅  ${languages.length} ${TranslateService.translations.en.pluralize(languages.length, 'language')} loaded:\n\t${TS()}`))
            .catch(x=>{
                console.error(x);
                console.error(`\t${TS()}`);
            })
    }
    static capitalize(a:string) {
        return `${a.charAt(0).toLocaleUpperCase()}${a.slice(1)}`;
    }
    static registerFunctionalMap(language:string | TranslationEntry, key:string, map:TranslationMapFunctionRef) {
        if (!(language as TranslationEntry).pluralize)
            language = TranslateService.translations[(language as string)];
        (map as TranslationEntry).pluralize = (language as TranslationEntry).pluralize;
        return language[key] = map;
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