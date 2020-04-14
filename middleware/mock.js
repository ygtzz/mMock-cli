const {mock, Random} = require('mockjs')
const faker =  require('faker')
const {getApiKey} = require('../common/util');
const _ = require('lodash');
const RouteParser = require('route-parser');

faker.locale = "zh_CN"

const parseMock = (body, params) => {
	Random.extend({
		param: name => {
			return params && params[name] ? params[name] : ''
		}
	})
	let mockParse;
	try {
		body = JSON.stringify(body);
		let bodyObj = JSON.parse(body);
		let isArray = Array.isArray(bodyObj);
		mockParse = isArray ? JSON.stringify(mock({"array|1-20": bodyObj}).array) : JSON.stringify(mock(JSON.parse(body)))
	} catch(e) {
		mockParse = `{err: ERROR: ${e.message}}`;
	}
	return faker.fake(mockParse);
}

const getApiContent = function(ctx){
	const {method,url,db} = ctx;
	const key = getApiKey(method.toLowerCase(),url);
	let content = db.get(key).value();
	if(!content){
		const allApis = db.get('apis').value();
		_.find(allApis, (val, key) => {
			let keys = key.split('|');
			let theUrl = keys.length > 1 ? keys[1] : keys[0];
			const parser = new RouteParser(theUrl);
			const params = parser.match(url)
			if(params && !content){
				ctx.routerParams = params
				content = allApis[key]
				return true
			}
		})
	}
	return content;
}

module.exports = () => async (ctx, next) => {
	const content = getApiContent(ctx);
	if(content){
		ctx.body = JSON.parse(parseMock(content, ctx.routerParams))
	}
    await next()
}