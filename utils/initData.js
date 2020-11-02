module.exports = function(flag) {
    let resData = {
        retCode: '1',
        reMessage: '请求成功',
        data: ""
    }
    let errData = {
        retCode: '0',
        reMessage: '请求异常',
        data: ""
    }
    return new Promise((resolve, reject) => {
        if (flag) {
            resolve(resData);
        }else {
            resolve(errData);
        }
    })
}