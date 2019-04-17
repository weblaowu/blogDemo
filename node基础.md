> - node.js day01 -

#### Node基础部分
 - Node.js 不是一门语言也不是框架，它只是基于 Google V8 引擎的 JavaScript 运行时环境,使得 JavaScript 能够同时具有 DOM 操作(浏览器)和 I/O、文件读写、操作数据库(服务器端)等能力，是目前最简单的全栈式语言。
#### Node.js 特点
 1. Node.js 是一个基于 Google V8 引擎的 JavaScript 运行时环境(v8底层是C/C++).
 2. Node.js 是一个基于**事件驱动**和**异步I/O** 的服务端JS运行环境, 使其轻量又高效。
 3. Node.js 的包管理器 npm, 是全球最大的开源库生态系统

3、JS是单线程语言
 - 进程： 是系统进行资源分配和调度的基本单位 (一个运行的程序)
  多进程： 多个进程同时切换工作
 - 线程：进程内一个相对独立的可调度的执行单元，与同属一个进程的线程共享进程的资源。
 - CPU密集： 压缩、解压、加密、解密、逻辑计算
   I/O密集：文件操作、网络操作、数据库操作

> 浏览器是多线程的
> 1. 浏览器事件触发线程           
> 2. 定时器触发线程           
> 3. 异步HTTP请求线程           
> 4. JS引擎和UI引擎是同一个线程

> Node.js 常用场景 
  Web Server
  本地代码构建
  实用工具开发
  
> 开发环境 
 安装 node 
 node 遵循 CommonJS 规范
 global  process
 基本规则：
   1. 每一个文件就是一个模块，有自己的作用域
   2. 在模块内部 module 变量代表模块本身
   3. module.exports属性代表模块对外的接口 


>3. 全局环境变量 
> __filename | __driname | exports | module.exports 
>4. 全局对象  
> http | fs | path 
```js {.line-numbers}
// server.js
// 引入读取文件模块  
const fs = require('fs');
// 调用读取方法 异步方法
fs.readFile('./server.js','utf8',(err, data)=>{
  if(err) throw err;
  console.log(data);
});
// 写入文件 异步方法
fs.writeFile('./server.js','我是...',(err)=>{
  if(err) throw err;
  console.log('写入成功!');
})
```
#### node 调试
 1. inspector 检查器 
 在 chrome 浏览器中输入地址 chrome://inspect 进入 DevTools
 node 中输入命令 node --inspect-brk [文件路径] 
 2. VScode 进入调试栏中进行配置
    会生成一个launch.json 
    {
      "type": "node",
      "request": "launch",
      "name": "Crueent file",
      "program": "${file}",
      "cwd":"${cwd}"
    }
#### Node 基本API(核心模块) 
1、path : 路径管理模块
  normalize join resolve 
  basename : 返回 path 的最后一部分 
  extname  : 返回 path 的扩展名
  dirname  : 返回 path 的目录名
  parse format
  sep delimiter win32 posix 
  
2、events模块 : 事件触发器  
  大多数Node.js核心API构建于惯用的异步事件驱动构架，所有能触发事件的对象都是 EventEmitter 类的实例。它提供了一些API用于绑定事件和触发事件。
  1. 绑定事件 
    EventEmitter.on('事件名', 事件回调fn)
    this -> EventEmitter的实例
  2. 触发事件
    EventEmitter.emit('事件名',参数...)
  3. 绑定一次
    EventEmitter.once('事件名',参数...)
  4. error事件
     作为最佳实践，应该始终为 'error' 事件注册监听器   
    myEmitter.emit('error', new Error('错误信息'));
  5. 移除事件
     EventEmitter.removeListener('事件名') 

3、fs模块 : 文件操作 
  1. 判断文件是否存在： fs.stat('文件路径',回调函数fn) 
  2. 修改文件名： fs.rename('原文件名','修改文件名',回调函数)
  3. 删除文件 ： fs.unlink('文件名',回到函数)
  4. 读取目录的内容：fs.readdir('路径',回调函数)
  5. 创建目录：fs.mkdir('路径',回调函数)
  6. 监听文件内容改变： fs.watch('文件/目录',options|{},function(eventType, filename){})
   options: {} / 'utf8'
      recursive : 监视子目录还是当前目录，默认 false 
   回调参数：
    eventType : rename / change 
    filename：是触发事件文件的名称

#### Node 全局变量
>1、Buffer (缓冲)
Buffer: 在引入 TypedArray 之前，JavaScript 没有读取或操作二进制数据流的机制。 Buffer 类用于在 TCP 流或文件系统操作等场景中处理字节流。
- 缓冲区Buffer是暂时存放输入输出数据的一段内存
- JS语言没有二进制数据类型，而在处理TCP和文件流的时候，必须要处理二进制数据
- NodeJS 提供了一个 Buffer 对象来处理二进制数据
- Buffer 类是一个全局变量，使用时无需require，直接使用
- Buffer 好比由一个8位字节元素组成的数组，可以有效的在JS中表示二进制数据
- 实例类似整数数组，大小固定，不能随意修改数组内容长度 
- node v6.0.0 之后废弃使用 new Buffer
2、什么是字节
- 字节(byte)是计算机存储时的一种计量单位，一个字节等于8位二进制
- 一位就代表一个0|1，每8个位(bit)组成一个字节
- 字节是通过网络传
 
3、Buffer API
1. Buffer.alloc() 
2. Buffer.allocUnsafe() 
3. Buffer.from() 
#### 第三方模块
>1、全局安装 -g(只能在命令行中使用)
  默认的安装路径是（npm root -g）,不会自动加入到环境变量中而是通过npm映射
npm install nrm -g 
nrm test 测试链接下载时间
nrm ls 显示所有的可用源
nrm use 可用源名  使用源 

>2、本地安装 
安装之前要初始化，记录安装依赖的
npm init -y  = package.json 

删除 - 怎么安装的怎么删除

安装全部依赖 npm install 
          
> fs module          