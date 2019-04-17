// 创建一个基础类
class BaseModel {
  constructor(data, message) {
    if(typeof data === 'string'){
      this.message = data;
      data = null;
      message = null;
    }
    if(data){
      this.data = data;
    }
    if(message){
      this.message = message;
    }
  }
}
// 请求拿到数据 ，设置code为0
class SuccessModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.code = 0;
  }
}
// 请求不成功 ，设置 code 为 -1
class ErrorModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.code = -1;
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
};
