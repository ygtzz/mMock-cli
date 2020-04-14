var path = require('path');

var sBase = './';
module.exports = {
    sBase: sBase,
    sDist: path.resolve(__dirname, '../static'),
    sDest: './static',
    entry: {
        index: sBase + 'pages/index/index.js'
    },
    dev: {
        proxy: {
            '/mmock':{
                target: 'http://localhost:8888'
            }
        },
        env: '',
        port: 8086,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},
    },
    pre: {
        
    },
    prod: {
        path: {
            script: 'static/scripts/',
            style: 'static/style/'
        }
    }
}