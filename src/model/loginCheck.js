const { exec } = require("../../db/mysql");

const loginCheck = (username, password) => {
  const sql = `select username, realname from users where username='${username}' and password=${password};`
  return exec(sql).then(rows=>{
    // select 查询出来的是数组
    // 如果查询不到，rows[0] 是 undefined
   return rows[0] || {};
  })
};

module.exports = {
  loginCheck
}
