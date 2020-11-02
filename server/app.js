const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const koaBody = require('koa-body');
const jwtKoa = require('koa-jwt');
const koaStatic = require('koa-static');

app.use(async (ctx, next) => {
    // 工具函数，通过一个工具类关联起来
    ctx.util = {
        mysql: require('../utils/doMysql'),
        uploadImg: require('../utils/uploadImg'),
        token: require('../utils/token'),
        crawler: require('../utils/crawler'),
        initData: require('../utils/initData')
    }
    // knex操作数据库
    ctx.knex = require('../utils/knex')
    await next()
})

// await next() 对于任何请求，APP调用异步函数处理请求  logger   中间件
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`请求方式：${ctx.method}；请求位置：${ctx.url}；消耗时间：${rt}`);
})

// 计算响应时间    中间件
app.use(async (etx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    etx.set('X-Response-Time', `${ms}ms`);
})

// 解决跨域    中间件
app.use(cors({
    origin: '*',
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

//获取post请求参数
// app.use(bodyParser());

// json
app.use(json());

// 静态资源处理
app.use(koaStatic(__dirname + '/public'));

// 查询字符串并解析到ctx.response.query，并且可以接受文件
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 2000 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
    }
}));

// 路由权限控制,除了登录注册都要穿token
app.use(jwtKoa({
    secret: 'lihao101'
}).unless({
    // 设置login、register接口，可以不需要认证访问
    path: [
        /^\/user\/insert/,
        /^\/user\/login/,
        /^((?!\/api).)*$/ // 设置除了私有接口外的其它资源，可以不需要认证访问
    ]
}));

// 请求拦截
app.use(function (ctx, next) {
    if (ctx.method == 'POST' && ctx.url.indexOf('login') < 0 && ctx.url.indexOf('re') < 0) {
        let token = ctx.util.token.doToken(ctx.request.header.authorization)
        if (!!token && token.username && token.password) {
            return next();
        }else {
            return next().catch((err) => {
                ctx.status = 401;
                ctx.body = 'Protected resource, use Authorization header to get access\n';
            });
        }
    }else {
        return next();
    }
});

// 路由模块使用前需要先安装和实例化
let homeRoute = require('../router/home');
let userRoute = require('../router/user');
router.use('/home', homeRoute.routes(), homeRoute.allowedMethods())
router.use('/user', userRoute.routes(), userRoute.allowedMethods())
app.use(router.routes())

app.listen(8888, () => {
    console.log('listen 8888');
})