const superagent = require("superagent");
const cheerio = require("cheerio");

let crawler = function (url) {
    return new Promise((resolve, reject) => {
        let htmlContent = '';
        let v2exContent = '';
        let data = [];
        if (url === 'oschina') {
            superagent
                .get('https://news.baidu.com/')
                .end(function (err, res) {
                    if (err) {
                        reject(err);
                    }
                    let $ = cheerio.load(res.text, {
                        decodeEntities: true
                    });

                    $('a').each((id, element) => {
                        console.log(element);
                        // let $element = $;
                        let reg = new RegExp("^\/news", "g");
                        let reg1 = new RegExp("^\/p", "g");
                        let address = $(element).attr('href');
                        let text = $(element).text();
                        if (reg.test($(element).attr('href')) || reg1.test($(element).attr('href'))) {
                            address = 'http://www.oschina.net' + $(element).attr('href');
                        }
                        data.push({
                            address,
                            text
                        })
                        htmlContent += '<a href=\"' + address + '\" target=\"_balank\">' + $(element).text() + '</a><br><br>';
                    });
                    resolve(data);
                });
        } else {
            superagent
                .get('https://www.v2ex.com/api/topics/hot.json')
                .end(function (err, res) {
                    let v2ex = '';
                    let arr = JSON.parse(res.text);
                    if (res != '') {

                        for (let i = 0; i < arr.length; i++) {
                            // console.log(arr[i]);
                            v2exContent += '<a href=\"' + arr[i].url + '\" target=\"_balank\">' + arr[i].title + '</a><br><br>';
                        }
                    }
                    resolve(v2exContent);
                });
        }
    })
}
let myCrawler = function (url) {
    return new Promise((resolve, reject) => {
        let htmlContent = [];
        superagent
            .get(url)
            .end(function (err, res) {
                if (err) {
                    reject(err);
                }
                let $ = cheerio.load(res.text, {
                    decodeEntities: true
                });

                $('a').each((id, element) => {
                    let address = $(element).attr('href');
                    let text = $(element).text();
                    if (!!address && (address.indexOf('http')>=0 || address.indexOf('www')>=0) && !!text) {
                        htmlContent.push({
                            address,
                            text
                        })
                    }
                });

                resolve(htmlContent);
            });
    })
}

module.exports = {
    crawler,
    myCrawler
}