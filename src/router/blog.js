const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require("../model/resblog");
const { SuccessModel, ErrorModel } = require("../model/resModel");

/* 登录验证 */
const loginCheck = (req)=>{
  if(!req.session.username){
    return Promise.ErrorModel('尚未登录')
  }
} 

const handleBlogRouetr = (req, res) => {
  const method = req.method;
  const id = req.query.id ;
  // 获取博客列表
  if (method === "GET" && req.path === "/api/blog/list") {
    // 获取author keyword
    const author = req.query.author || "";
    const keyword = req.query.keyword || "";
    // 返回的是 promise 对象
    return getList(author, keyword).then(listData => {
      return new SuccessModel(listData);
    });
  }

  // 获取博客详情
  if (method === "GET" && req.path === "/api/blog/detail") {
    const result = getDetail(id);
    // promise 对象
    return result.then(data => {
      return new SuccessModel(data);
    });
  }

  // 新建一个博客
  if (method === "POST" && req.path === "/api/blog/new") {
    const loginCheckResult = loginCheck(req); 
    if(loginCheckResult){
      // 有值是未登录
      return loginCheck;
     }
    // 暂时用假数据，author . 因为新建要登录，没有登录，获取不到author
    req.body.author = req.session.username;
    const result = newBlog(req.body);
    return result.then(data => {
      return new SuccessModel(data);
    });
  }

  // 更新博客
  if (method === "POST" && req.path === "/api/blog/update") {
    const loginCheckResult = loginCheck(req); 
    if(loginCheckResult){
      // 有值是未登录
      return loginCheck;
     }
    
    const result = updateBlog(id, req.body);
    return result.then(val => {
      if (val) {
        return SuccessModel();
      }
      return new ErrorModel("更新博客失败!");
    });
  }
  // 删除一个博客
  if (method === "POST" && req.path === "/api/blog/del") {
    const loginCheckResult = loginCheck(req); 
    if(loginCheckResult){
      // 有值是未登录
      return loginCheck;
     }
    const author = req.session.username;
    const result = delBlog(id, author);
    return result.then(val => {
      if(val){
        return new SuccessModel();
      }
      return new ErrorModel("删除博客失败!");
    })
  }
};

module.exports = handleBlogRouetr;
