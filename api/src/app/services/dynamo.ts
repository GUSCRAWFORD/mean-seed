import {
    ODataV4GenericRepo,
    OperationContext,
    OperationSet,
    HasKey,
    ExpressLikeODataQuery,
    ConnectionInfo,
    JYV_CONFIG
} from '@jyv/core';
import './aws';
const dynamo = require('dynamodb');
        dynamo.AWS.config.update({region: "us-east-1"}); // region must be set
import * as Joi from 'joi';
import { HTTP_VERSION_NOT_SUPPORTED } from 'http-status-codes';
import { resolve } from 'dns';
export class DynamoRepo<T extends HasKey> extends ODataV4GenericRepo<T>{
    static dynamo = dynamo;
    static all:{[key:string]:DynamoRepo<any>} = {};
    constructor(name:string, private definition:{[key:string]:any}, public connectionConfig?:ConnectionInfo) {
        super(name);
        this.connectionConfig = connectionConfig || new ConnectionInfo();
        this.model = dynamo.define(
            `${process.env.NODE_ENV?process.env.NODE_ENV+'.':'local.'}${this.connectionConfig.schema?this.connectionConfig.schema+'.':''}${name}`,
            definition
        );
        DynamoRepo.all[name] = this;
    }
    static inferModel(proto:object) {
        if(JYV_CONFIG.debugMode("dynamodb")) console.info(`📦  Inferring model:\n${JSON.stringify(proto,null,'')}`);
        var joi = {};
        Object.keys(proto).forEach(
            prop=>{
                var propType = typeof proto[prop];
                switch(propType) {
                    case 'string': case 'number':
                        joi[prop] = Joi[propType]();
                        break;
                    case 'object':
                        if (proto[prop] instanceof Array) {
                            var sample = proto[prop][0], sampleType = typeof sample;
                            switch (sampleType) {
                                case 'string': case 'number':
                                    joi[prop] = DynamoRepo.dynamo.types[`${sampleType}Set`]()
                                    break;
                                default:
                                    joi[prop] = DynamoRepo.dynamo.types.stringSet();
                            }
                        }
                        break;
                    default:
                }
            }
        );
        if(JYV_CONFIG.debugMode("dynamodb")) {
            console.info(`📦  ... inferred:`);
            console.info(joi);
        }
        return joi;
    }
    private initialized:Promise<DynamoRepo<T>> = null as any;
    model: any;
    private async ready() {
        return this.initialized = new Promise((resolve, reject)=>{
            if(JYV_CONFIG.debugMode("dynamodb")) {
                var start = new Date();
                console.info(`⏱  Initizalizing table "${process.env.NODE_ENV?process.env.NODE_ENV+'.':'local.'}${this.connectionConfig&&this.connectionConfig.schema?this.connectionConfig.schema+'.':''}${this.name}" at ${start.toLocaleString('en')}`);
            }
            var inst = this;
            dynamo.createTables(function(err) {
                if(JYV_CONFIG.debugMode("dynamodb")) {
                    var stop = new Date();
                    console.info(`⏱  ... finsihed initializing "${inst.name}" in ${stop.valueOf()-start.valueOf()} ms`);
                }
                if (err) return reject(err);
                return resolve(inst);
            })
        });
    }
    async query(query?: ExpressLikeODataQuery, context?: OperationContext<T>): Promise<Array<T>>{
        var isnt = this, queryOrScan = 'scan', oper;
        //if (query&&query.$filter&&query.$filter.startsWith(this.definition.hashKey))
        return new Promise((resolve, reject)=>{
            oper = isnt.model.scan();
            if (query&&query.$top)
                oper.limit(query.$top);
            oper.loadAll();
            oper.exec(function (err, item){
                if (err) return reject(err);
                return resolve(item);
            })
        })
    };
    async create(data:T, context?:OperationContext<T>) {
        return new Promise<T>((resolve, reject)=>{
            new this.model(data).save(function(err){
                if (err) return reject(err);
                return resolve(data);
            })
        });
    }
    async read(key: string, query?: ExpressLikeODataQuery, context?: OperationContext<T>): Promise<T> {
        var inst = this;
        return new Promise((resolve,reject)=>{
            inst.model.get(key, function(err, item){
                if (err) return reject(err);
                return resolve(item);
            })
        });
    }
    async upsert(key: any, data: any, context?: OperationContext<T>): Promise<T> {
        return new Promise<T>((resolve, reject)=>{
            data[this.definition.hashKey] = key;
            new this.model(data).save(function(err){
                if (err) return reject(err);
                return resolve(data);
            })
        });
    };
    async update(query: ExpressLikeODataQuery, delta: any, context?: OperationContext<T>): Promise<number>{
        var inst = this, csvKeys, keys;
        if (query&&query.$filter&&query.$filter.match(new RegExp(`${inst.definition.hashKey}\\s+(in|eq|nin|neq)\\s+\\S+(,\\s*\\S+)*`,'g'))) {
            csvKeys = query.$filter.split(new RegExp("\\s+(in|eq|nin|neq)\\s+"));
            keys = csvKeys.split(/\s*,\s*/);
            return Promise.all(keys.map(
                key=>inst.upsert(key, delta, context)
            )).then(set=>Promise.resolve(set.length));
        }
        return Promise.resolve(0);
    };
    async delete(query: ExpressLikeODataQuery, context?: OperationContext<T>): Promise<number> {
        var inst = this, csvKeys, keys;
        if (query&&query.$filter&&query.$filter.match(new RegExp(`${inst.definition.hashKey}\\s+(in|eq|nin|neq)\\s+\\S+(,\\s*\\S+)*`,'g'))) {
            csvKeys = query.$filter.split(new RegExp("\\s+(in|eq|nin|neq)\\s+"));
            keys = csvKeys.split(/\s*,\s*/);
            return Promise.all(keys.map(
                key=>new Promise((resolve,reject)=>{
                    inst.model.destroy(key, function(err, item){
                        if (err) return reject(err);
                        return resolve(item);
                    })
                })
            )).then(set=>Promise.resolve(set.length));
        }
        return Promise.resolve(0);
    };
    public get init() {
        return this.initialized?Promise.resolve(this.initialized):this.ready();
    }
}