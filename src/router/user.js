const { login } = require('../model/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { set } = require('../../db/redis');
const handleUserRouter = (req, res) => {
  const method = req.method;
  // 登录接口
  if (method === "POST" && req.path === "/api/user/login") {
    const { username, password } = req.body;
    const result = login(username, password);
    return result.then(data => {
      if(data.username){
        // 设置 session 的值  
        req.session.username = data.username
        req.session.realname = data.realname
        // 再把 session 设置的到redis中
        set(req.sessionId, req.session)
        return new SuccessModel()
      }
      return new ErrorModel("登录失败")
    })
  }

};

module.exports = handleUserRouter;