const handleUserRouter = require("./src/router/user");
const handleBlogRouter = require("./src/router/blog");
// 内置模块，处理url后面的参数
const querystring = require("querystring");
// 引入redis
const {get ,set} = require('./db/redis');

// 用于处理 post data
const getPostData = req => {
  return new Promise(resolve => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    if (req.headers["content-type"] !== "application/json") {
      resolve({});
      return;
    }
    let postData = "";
    // 监听 data 数据 ， chunk 是 buffer 形式
    req.on("data", chunk => {
      postData += chunk.toString();
    });
    // 数据传输结束，触发 end 事件
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      // JSON.parse 讲json字符串解析成JS对象
      resolve(JSON.parse(postData));
    });
  });
};

// 设置 cookie 的过期时间
const setCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 3600);
  console.log(d.toGMTString());
  return d.toGMTString();
};


// 返回的 server 回调
serverHandle = (req, res) => { 
  // 设置响应头 数据类型是 json
  res.setHeader("Content-type", "application/json");
  // 获取请求路由路径
  const url = req.url;
  // 获取路由路径
  req.path = url.split("?")[0];
  // 获取 GET 请求的参数 url?[key=value&key=value]
  req.query = querystring.parse(url.split("?")[1]);
  console.log('req.query ---',req.query)
  // 解析 cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || "";
  cookieStr.split(";").forEach(item => {
    if (!item) {
      return;
    }
    const arr = item.split("=");
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
  });
 
  // 解析 session 使用 redis 
  let needSetCookie = false;
  let userId = req.cookie.userid;
  if(!userId){
    needSetCookie = true;
    // 没有userId，就生成一个随机数，保证不重复
    userId = `${Date.now()}`;
    // 初始化 redis 中的 session 值 
    set(userId, {})
  }
  // 获取 session 
  req.sessionId = userId;
  get(req.sessionId).then(sessionData=>{
    if(sessionData == null){
      // 初始化 redis 中的 session 值
      set(req.sessionId, {})
      // 设置 session 
      req.session = {};
    }else{
      // 设置 session 
      req.session = sessionData;
    }
    console.log('req.session---', req.session)
  })

  // 处理 postData
  getPostData(req).then(postData => {
    // 拿到 post请求传入的Data
    req.body = postData;
    /**  处理 blog 路由*/
    // 引入blog操作的路由 返回 promsie 对象
    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader(
            "Set-Cookie",
            `userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()}`
          );
        }
        res.end(
          // 返回JSON格式
          JSON.stringify(blogData)
        );
      });
      return;
    }
    // 引入用户的路由
    const userResult = handleUserRouter(req, res);
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          res.setHeader(
            "Set-Cookie",
            `userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()}`
          );
        }
        // 放回JSON格式
        res.end(JSON.stringify(userData));
      });
      return;
    }
    // 都没有命中上面的路由，返回 404
    res.writeHead(404, { "Content-type": "text/plain" });
    res.write("404 Not Found\n");
    res.end();
  });
};

module.exports = serverHandle;
