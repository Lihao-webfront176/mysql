const _url = require('url');

const Router = require('koa-router');
const home = new Router();

// /home 抓包学习
home.get('/crawler', async (ctx, next) => {
    let body =  await ctx.util.crawler.crawler('oschina');
    if (!!body) {
        await ctx.knex('crawler').returning('id').insert({
            detail: JSON.stringify(body),
            crawler_time: new Date().getTime()
        })
        let res = await ctx.util.initData(true);
        res.data = body;
        ctx.body = res;
    }else {
        ctx.body = await ctx.util.initData(false);
    }
})

// 抓包入库
home.get('/myCrawler', async (ctx, next) => {
    let urlobj = _url.parse(encodeURI(ctx.request.url), true);
    console.info(urlobj);
    let url = urlobj.query.url;
    if (!!url) {
        let body = await ctx.util.crawler.myCrawler(url);   
        await ctx.knex('crawler').returning('id').insert({
            detail: JSON.stringify(body),
            crawler_time: new Date().getTime()
        })
        let res = await ctx.util.initData(true);
        res.data = body;
        ctx.body = res;
    }else {
        let res = await ctx.util.initData(false);
        ctx.body = res;
    }
})

// 返回抓包数据
home.post('/crawlerList', async (ctx, next) => {
    let res = await ctx.util.initData(true);
    res.data = await ctx.knex.select().from('crawler');
    ctx.body = res;
})

// home/list
home.get('/list', async (ctx, next) => {
    ctx.response.status = 200
    ctx.response.body = 'home-list'
})

module.exports = home