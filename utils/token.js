// 关于token操作

const jwt = require('jsonwebtoken');
let secret = "lihao101";

module.exports = {
 	getToken: (payload = {}) => {
	    return jwt.sign(payload, secret, { expiresIn: '2h' });
	},

	doToken: (token = {}) => {
	    return jwt.verify(token.split(' ')[1], secret);
	}
}
