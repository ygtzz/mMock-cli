const yargs = require('yargs');
const koa = require('koa');
const logger = require('koa-logger');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser')
const db = require('./middleware/db');
const router = require('./middleware/router');
const mock = require('./middleware/mock');
const _ = require('lodash');
const pkg = require('./package.json');
const argv = yargs.version(false).help(false).argv;

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
    `);
}
else{
    const defaultOpts = {
        port: 8888,
        domain: 'http://localhost',
        db: 'mock.json'
    }
    const cfg = _.merge({},defaultOpts,{
        port: argv.port || argv.p,
        domain: argv.domain || argv.d,
        db: argv.db
    })

    const app = new koa();
    app.use(logger());
    app.use(bodyParser());
    app.use(static(__dirname + '/static'));
    app.use(db(cfg.db));
    app.use(router.routes()).use(router.allowedMethods());
    app.use(mock());

    app.listen(cfg.port,'0.0.0.0',() => {
        console.log(`mMock server listening ${cfg.domain}:${cfg.port}`)
    })
}

