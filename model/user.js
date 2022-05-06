const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/2202"); // 2202指的是数据库名字

const Schema = mongoose.Schema;
// 用户模块有三个字段
const userSchema = new Schema({
  imgurl: String, // 图片路径
  username: String, // 用户名
  password: String, // 密码
});

// 第一个参数表示模型名字，将来用于多表关联使用,第二个参数将来数据库集合中的字段
// 第三个参数表示数据库集合表名字,如果不写第三个参数的话，那么将来在数据库中会以
// 第一个参数的复数作为集合名字
const User = mongoose.model("User", userSchema, "user");

module.exports = User;
