const { loginCheck } = require('../model/loginCheck');
const { SuccessMolel, ErrorMolel } = require('../model/resModel');
const handleUserRouter = (req, res) => {
  const method = req.method;
  // 登录接口
  if (method === "POST" && req.path === "/api/blog/users") {
    const { username, password } = req.body;
    console.log(username, password);
    const result = loginCheck(username, password);
    return result.then(data =>{
      if(data.username){
        return new SuccessMolel()
      }
      return new ErrorMolel("登录失败")
    })
  }
};

module.exports = handleUserRouter;