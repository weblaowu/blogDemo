const redis = require("redis");
const { REDIS_CONF } = require("./db.config");

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
// 注册错误事件
redisClient.on("error", err => {
  console.error(err);
});

// 封装 API
function set(key, val) {
  //如果 val 是对象要把她转化成 字符串，只能存字符串
  if (typeof val === "object") {
    val = JSON.stringify(val);
  }
  redisClient.set(key, val, redis.print);
}
function get(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err);
        return;
      }
      // 如果key不存在，就返回null
      if (val === null) {
        resolve(null);
        return;
      }
      // 如果得到是JSON格式数据，就解析成JS对象返回，否则直接返回
      try {
        resolve(JSON.parse(val));
      } catch (err) {
        resolve(val);
      }
    });
  });
}

module.exports = {
  set,
  get
};
