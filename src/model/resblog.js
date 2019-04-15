const { exec } = require("../../db/mysql");

// 获取博客列表
const getList = (author, keyword) => {
  // 定义 sql 语句
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }
  sql += `order by createtime desc;`;
  return exec(sql);
};

// 获取博客详情
const getDetail = id => {
  let sql = `select * from blogs where id='${id}' `;
  return exec(sql).then(rows => {
    // 返回一个对象
    return rows[0];
  });
};

// 新建一个博客
const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象，包含 title content author 属性

  const { title, content, author } = blogData;
  // 插入博客数据，返回一个 id
  let sql = `insert into blogs (title, content, createtime, author) values ('${title}', '${content}', ${Date.now()}, '${author}');`;
  return exec(sql).then(insertData => {
    console.log("insertData in: ", insertData);
    return {
      id: insertData.insertId
    };
  });
};

// 更新一个博客
const updateBlog = (id, blogData = {}) => {
  // id 是要更新的博客的 id
  // blogData 是一个博客对象，包含 title content 属性
  const { title, content } = blogData;
  const sql = `update blogs set title='${title}', content='${content}' where id=${id};`;
  return exec(sql).then(updateData => {
    // 更新成功 affectedRows 是大于 0 的
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};
// 删除一个博客
const delBlog = (id, author) => {
  const sql = `delete from blogs where id=${id} and author='${author}'`;
  return exec(sql).then(delData=> {
    if (delData.affectedRows > 0) {
      return true;
    }
    return false;
  })
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
};
