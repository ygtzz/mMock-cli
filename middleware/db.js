const low  = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path  = require('path');
const _  = require('lodash');

const defaults = {
	apis: {
		"get|/example": {
			"name": "@name"
		}
	}
}

function createDB(dbName){
	const dbPath = path.join(~dbName.indexOf('json') ? dbName : dbName + '.json');
	const db = low(new FileSync(dbPath));
	db.defaults(defaults).write();
	return db;
}

module.exports = dbName => async (ctx, next) => {
	ctx.db = createDB(dbName);
	await next()
}