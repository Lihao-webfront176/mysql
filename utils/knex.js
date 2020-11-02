const knex = require('knex');

// 数据库处理knex
module.exports = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: '123456',
        database: 'learn'
    },
    debug: true, //指明是否开启debug模式，默认为true表示开启
    pool: { //指明数据库连接池的大小，默认为{min: 2, max: 10}
        min: 0,
        max: 7,
    },
    acquireConnectionTimeout: 10000, //指明连接计时器大小，默认为60000ms
    migrations: {
        tableName: 'migrations' //数据库迁移，可选
    }
})