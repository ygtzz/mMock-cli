const low  = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path  = require('path');
const _  = require('lodash');

const defaults = {
	apis: {
		"get|/example": {
			"status": "200",
			"msg": "OK",
			"data|10": [
				{
					"name": "@name",
					"plan_date": "@date('yyyy-MM-dd')",
					"cwname": "@string",
					"productspecification": "@string",
					"plan_qty": "@integer(1,1000)",
					"plan_made": "@integer(1,1000)",
					"comp_qty": "@integer(1,1000)",
					"plan_comp_per": "@float(0,0,0,3)"
				}
			]
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