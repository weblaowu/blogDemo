const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require("../model/resblog");
const { SuccessMolel, ErrorMolel } = require("../model/resModel");
const handleBlogRouetr = (req, res) => {
  const method = req.method;
  const id = req.query.id;

  // 获取博客列表
  if (method === "GET" && req.path === "/api/blog/list") {
    // 获取author keyword
    const author = req.query.author || "";
    const keyword = req.query.keyword || "";
    // 返回的是 promise 对象
    return getList(author, keyword).then(listData => {
      return new SuccessMolel(listData);
    });
  }

  // 获取博客详情
  if (method === "GET" && req.path === "/api/blog/detail") {
    const result = getDetail(id);
    // promise 对象
    return result.then(data => {
      return new SuccessMolel(data);
    });
  }

  // 新建一个博客
  if (method === "POST" && req.path === "/api/blog/new") {
    // 暂时用假数据，author . 因为新建要登录，没有登录，获取不到author
    req.body.author = "wuxiess";
    const result = newBlog(req.body);
    return result.then(data => {
      return new SuccessMolel(data);
    });
  }

  // 更新博客
  if (method === "POST" && req.path === "/api/blog/update") {
    const result = updateBlog(id, req.body);
    return result.then(val => {
      if (val) {
        return new SuccessMolel();
      }
      return new ErrorMolel("更新博客失败!");
    });
  }
  // 删除一个博客
  if (method === "POST" && req.path === "/api/blog/del") {
    const author = "wuxiess";
    const result = delBlog(id, author);
    return result.then(val => {
      if(val){
        return new SuccessMolel();
      }
      return new ErrorMolel("删除博客失败!");
    })
  }
};

module.exports = handleBlogRouetr;
