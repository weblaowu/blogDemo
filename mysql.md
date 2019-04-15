use myblog;
-- show tables;
-- 插入表 
-- insert into blogs (title,content,createtime,author) values ('标题B','内容B','1554967745278','lisi');

-- select * from blogs;

-- select id,username,realname from users;
-- 查询条件 
-- select * from users where username='zhangsan' and `password`=123;
-- 模糊查询 
-- select * from users where username like '%li%'
-- 排序 
select * from users where username like '%li%' order by id desc;