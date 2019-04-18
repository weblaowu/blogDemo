// 创建一个 http 服务
const http = require("http");
// 引入 server 回调
const serverHandle = require('../app');
// 设置端口 
const PORT = 8000;
// 创建 server 
const server = http.createServer(serverHandle);
// 监听端口 
server.listen(PORT);

console.log('end------')
