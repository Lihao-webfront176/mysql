const fs = require('fs');
const koaMulter = require('koa-multer');

module.exports = (ctx) => {
    let file = ctx.request.files.file; // 获取上传文件
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let savePath = `./public/${file.name}`;
    let remotefilePath = 'http://localhost:8888/' + file.name;
    // 创建可写流
    const upStream = fs.createWriteStream(savePath);
	// 可读流通过管道写入可写流
	try {
		reader.pipe(upStream);
	    return ctx.body = {
	        url: remotefilePath,
	        headImg: file.name,
	        retMessage: "文件上传成功",
	        retCode: '1'
	    }
	}catch {
		return ctx.body = {
			retCode: '0',
			retMessage: "文件上传失败"
		}
	}
}