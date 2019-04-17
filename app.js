const handleUserRouter = require("./src/router/user");
const handleBlogRouter = require("./src/router/blog");
// 内置模块，处理url后面的参数
const querystring = require("querystring");

// session 数据
const SESSION_DATA = {};

// 用于处理 post data
const getPostData = req => {
  const promise = new Promise((resolve, reject) => {
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
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

// 设置 cookie 的过期时间
const setCookieExpires = ()=> {
  const d = new Date();
  d.setTime(d.getTime() + 24*3600)
  console.log( d.toGMTString() )
  return d.toGMTString() 
}

// 创建 server 的方法
serverHandle = (req, res) => {
  // 设置请求头
  res.setHeader("Content-type", "application/json");
  // 获取请求路由路径
  const url = req.url;
  // 获取路由路径
  req.path = url.split("?")[0];
  // 获取GET请求的参数
  req.query = querystring.parse(url.split("?")[1]);
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

  // 解析 session
  let needSetCookie = false;
  let userId = req.cookie.userid;
  // 判断 cookie userid 是否存在
  if (userId) {
    // 如果存在，根据 SESSION_DATA 中的 userId
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {};
    }
  } else {
    // 设置设置 userId;
    needSetCookie = true;
    // 没有userId，就生成一个随机数，保证不重复
    userId = `${Date.now() + Math.random()}`;
    SESSION_DATA[userId] = {};
  }
  req.session = SESSION_DATA[userId];
  // 处理 postData
  getPostData(req).then(postData => {
    req.body = postData;
    /**  处理 blog 路由*/
    /**
     * const blogData = handleBlogRouter(req, res);
     * if (blogData) {
     *   res.end(JSON.stringify(blogData));
     *   return;
     * }
     */

    // 引入blog操作的路由 返回 promsie 对象
    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then(blogData => {
        if(needSetCookie){
          res.setHeader('Set-Cookie',`userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()}`);
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
        if(needSetCookie){
          res.setHeader('Set-Cookie',`userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()}`);
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
