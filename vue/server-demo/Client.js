const http = require("http");
const util = require('util');

http.get("http://www.imooc.com/u/card", (res) => {
    const {statusCode} = res;
    let error;
    if(statusCode!==200) {
        error = new Error("请求失败");
    }
    if (error) {
        console.error(error.message);
        return ;
    }
    res.setEncoding('utf-8');
    let rawData = '';
    res.on('data',(chunk) => { rawData += chunk; });
    res.on('end',() => {
        let start = rawData.indexOf('{');
        let end = rawData.indexOf('}')+1;
        rawData = rawData.substring(start,end);
        console.log(JSON.parse(rawData));
    });
})