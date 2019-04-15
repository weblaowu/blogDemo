const handleUserRouter = require("./src/router/user");
const handleBlogRouter = require("./src/router/blog");
// 内置模块，处理url后面的参数
const querystring = require("querystring");

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
serverHandle = (req, res) => {
  // 设置请求头
  res.setHeader("Content-type", "application/json");

  // 获取请求路由路径
  const url = req.url;
  // 获取路由路径
  req.path = url.split("?")[0];
  // 获取GET请求的参数
  req.query = querystring.parse(url.split("?")[1]);
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

    //返回 promsie 对象
    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then(blogData => {
        res.end(
          // 返回JSON格式
          JSON.stringify(blogData)
        );
      });
      return;
    }

    const userResult = handleUserRouter(req, res);
    if (userResult) {
      userResult.then(userData => {
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
