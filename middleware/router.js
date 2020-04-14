const Router = require('koa-router');
const {getApiKey} = require('../common/util');

const router = Router({
    prefix: '/mmock'
});

router.use(async(ctx, next) => {
    await next();
    const res = ctx.response;
    ctx.response.body = {
        code: res.status,
        msg: res.message,
        body: res.body
    }
})

router.get('/apis',async(ctx,next) => {
    const {db} = ctx;
    ctx.body = db.get('apis').value();
})

router.post('/api',async(ctx,next)=>{
    const {body} = ctx.request;
    const {db} = ctx;
    let key = getApiKey(body.method,body.url);
    db.set(key,JSON.parse(body.content)).write();
    ctx.body = {res: true}
})

router.delete('/api',async(ctx,next)=>{
    const {query} = ctx.request;
    const {db} = ctx;
    let key = getApiKey(query.method,query.url);
    db.unset(key).write();
    ctx.body = {res: true}
})

module.exports = router;