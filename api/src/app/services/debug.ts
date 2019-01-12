export const DEBUG = (topic:any)=>
    topic
        ?process.env.DEBUG&&(
            process.env.DEBUG==='*'||(process.env.DEBUG as any).split(',').find(t=>t===topic as any)
        )
        :false;