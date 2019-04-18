# blogDemo
# 记录问题
session： 即 server 端存储用户信息，和 cookie 里面的uerId 对应，实现用户会话，实现登录信息存储  

sesion的问题：目前session是JS变量，放在Node.js进程内存中

  1. 进程内存有限，访问量过大，内存暴增怎么办
  2. 正式上线运行时多进程，进程与进程之间无法共享 

解决方案：redis
  redis 是 web server 最常用的缓存数据库，数据存放在内存中
  相比mysql，访问速度快（内存和硬盘不是一个数量级的）
  但是成本更高，可存储的数据量更小（内存的硬伤）
  
  怎么解决：
  1. 将web Server 和redis 拆分为两个单独的服务
  2. 双方都是独立的，都是可扩展的（例如扩展成集群）
  3. mysql 也是一个单独的服务，也可扩展


 为什么 session 适合用 redis
  1. session 访问频繁，对性能的要求极高
  2. session 可不考虑断电丢失数据的问题（内存的硬伤）
  3. session 数据量不会太大(相比于mysql中存储的数据)  
  
 为什么网站数据不适合用redis
  1. 操作频率不是太高
  2. 断电不能丢失，必须保留
  3. 数据量太大，内存成本太高 


 Window 下 redis 安装：
  下载地址：https://github.com/MSOpenTech/redis/releases。
  把 Redis-x64-3.2.100.zip 压缩包解压到C盘，将文件夹重新命名为redis
  打开cmd窗口，切换到c:/redis运行：redis-server.exe redis.windows.conf
  在重新开启一个cmd窗口，原来不要关闭，不然就无法访问服务端了。
  运行：redis-cli.exe -h 127.0.0.1 -p 6379
  设值：set key value
  取值：get key 
  删除值：del key 


 用 redis 储存 seesion 
  1. node.js 连接redis 的 demo 
  2. 封装成工具函数，可供 API 使用
