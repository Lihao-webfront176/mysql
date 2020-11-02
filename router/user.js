const Router = require('koa-router');
const user = new Router();
var connect = {
	host: '127.0.0.1',
	user: 'root',
	password: '123456',
	port: '3306',
	database: 'learn'
};
var resData = {};

// user login
user.post('/login', async (ctx, next) => {
	let body = ctx.request.body;
	let xx = `\'${body.username}\' AND password = \'${body.password}\'`;
	if (!!body.username && !!body.password) {
		let result = await ctx.util.mysql('SELECT * FROM user WHERE username = '+ xx, connect);
		if (!!result && result.length > 0) {
			console.log(result, '查询用户成功');
			resData = await ctx.util.initData(true);
			resData.data = result;
			resData.token = ctx.util.token.getToken({username: result[0].username, password: result[0].password});
		}else {
			console.log(result, '查询用户失败');
			resData = await ctx.util.initData(false);
			resData.data = "用户名或密码错误";
		}
	}else {
		resData = await ctx.util.initData(false);
		resData.data = "用户名或密码不能为空";
	}
	ctx.body = resData;
	await next();
})

// headImg upload
user.post('/uploadImg', async(ctx, next) => {
	await ctx.util.uploadImg(ctx);
})

// user register
user.post('/register', async (ctx, next) => {
    let body = ctx.request.body;
    if (!body.username || !body.password || !body.local || !body.sex || !body.phone || !body.headImg) {
    	resData = await ctx.util.initData(false);
    	resData.data = '入参有误，请重新输入';
    }else {
	    let xx = `\'${body.username}\', \'${body.password}\', \'${body.phone}\', \'${body.local}\', \'${body.sex}\', \'${body.headImg}\'`;
	    let res = await ctx.util.mysql('INSERT INTO user (username, password, phone, local, sex, headImg) VALUES('+ xx + ')', connect);
		if (res.protocol41) {
			console.log(res, '注册入库成功');
			resData = await ctx.util.initData(true);
			resData.data = await ctx.util.mysql(`SELECT * FROM user WHERE userid = \'${res.insertId}\'`, connect)
			resData.token = ctx.util.token.getToken({username: body.username, password: body.password});
		}else {
			console.log(res, '注册入库失败');
			resData = await ctx.util.initData(false);
			resData.data = "新增失败";
		}
	}
	ctx.body = resData;
    await next()
})

// search user by username and password
user.post('/search', async (ctx, next) => {
	try {
		let userObj = await ctx.util.token.doToken(ctx.request.header.authorization);
		console.log(userObj);
		let xx = `\'${userObj.username}\' AND password = \'${userObj.password}\'`
		let userArr = await ctx.util.mysql('SELECT * FROM user WHERE username = '+ xx, connect);
		if (!userArr || userArr.length < 1) {
			resData = await ctx.util.initData(false);
		}else {
			userArr[0].headImg = 'http://localhost:8888/' + userArr[0].headImg;
			userArr[0].password = null;
			resData = await ctx.util.initData(true);
		}
		resData.data = userArr[0];
		ctx.body = resData;
	}catch {
		ctx.status = 401;
		resData = await ctx.util.initData(false);
		resData.data = '请重新登录';
		ctx.body = resData;
	}
	await next();
})

// updata user
user.post('/updata', async (ctx, next) => {
    let res = await ctx.util.mysql('UPDATE user SET name ='+ ctx.request.body.name +',age = '+ctx.request.body.age+' WHERE id = '+ctx.request.body.id, connect);
	if (res.protocol41) {
		resData = await ctx.util.initData(true);
	}else {
		resData = await ctx.util.initData(false);
	}
	ctx.body = resData;
    await next()
})

// delete user
user.post('/delete', async (ctx, next) => {
    let res = await ctx.util.mysql('DELETE FROM user WHERE id = '+ctx.request.body.id);
	if (res.protocol41) {
		resData = await ctx.util.initData(true);
	}else {
		resData = await ctx.util.initData(false);
	}
	ctx.body = resData;
    await next()
})

// search all users
user.post('/searchAll', async (ctx, next) => {
	let body = ctx.request.body;
	resData = await ctx.util.initData(false);
	resData.data = await ctx.util.mysql('SELECT * FROM user WHERE id > ' + body.pageSize * (body.pageNum-1) + ' AND id < ' + body.pageSize * body.pageNum, connect);
	ctx.body = resData;
	await next();
})

module.exports = user