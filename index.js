#!/usr/bin/env node

const yargs = require('yargs');
const koa = require('koa');
const logger = require('koa-logger');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser')
const db = require('./middleware/db');
const router = require('./middleware/router');
const mock = require('./middleware/mock');
const cors = require('./middleware/cors');
const _ = require('lodash');
const pkg = require('./package.json');
const argv = yargs.version(false).help(false).argv;
const open = require('open');

//TODO
//1. 编辑后格式丢失
//2. 非标准的json，可以识别，并自动格式化为json
//3. 表格按钮放大1.2倍

if(argv.v || argv.version){
    console.log(`version: ${pkg.version}`)
}
else if(argv.h || argv.help){
    console.log(`
    mMock Server
    
    Options:
    -h  --help      show help
    -v  --version   show version
    -d  --domain    set mock server url domain
    -p  --port      set mock server url port
        --db        set mock server db json file path
        --cors      1 is on, 0 is off, default is on
    `);
}
else{
    const defaultOpts = {
        port: 8888,
        domain: 'http://localhost',
        db: 'mock.json',
        cors: true
    }
    const cfg = _.merge({},defaultOpts,{
        port: argv.port || argv.p,
        domain: argv.domain || argv.d,
        db: argv.db,
        cors: typeof argv.cors === 'undefined' ? true : Boolean(argv.cors)
    })

    const app = new koa();
    app.use(logger());
    app.use(bodyParser());
    app.use(static(__dirname + '/static'));
    app.use(db(cfg.db));
    app.use(router.routes()).use(router.allowedMethods());
    cfg.cors && app.use(cors());
    app.use(mock());

    app.listen(cfg.port,'0.0.0.0',() => {
        let url = `${cfg.domain}:${cfg.port}`;
        console.log(`mMock server listening ${url}`);
	    open(url);
    })
}

