const { login } = require('../model/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handleUserRouter = (req, res) => {
  const method = req.method;
  // 登录接口
  if (method === "GET" && req.path === "/api/user/login") {
    const { username, password } = req.query;
    const result = login(username, password);
    return result.then(data => {
      if(data.username){
        // 设置 session 
        req.session.username = data.username
        req.session.realname = data.realname

        console.log('session is ---', req.session)

        return new SuccessModel()
      }
      return new ErrorModel("登录失败")
    })
  }

};

module.exports = handleUserRouter;