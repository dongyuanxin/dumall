let user = require("./User");
console.log(`TEST user name is :${user.userName}`);

let http = require("http");
let url = require("url");
let util = require("util");

let server = http.createServer((req,res) => {
    res.statusCode = 200;
    console.log("url: "+req.url);
    res.end(util.inspect(url.parse(req.url)));
})

server.listen(13140,"127.0.0.1",() => {
    console.log("a click");
})