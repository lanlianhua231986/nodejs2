const express = require("express");
const User = require("./model/user");
const bodyParser = require("body-parser");
const multer = require("multer");
const { rmSync } = require("fs");
const app = new express();

// 这个指的是将来存放的磁盘路径
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // 当前目录下面同级的uploads目录
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
// 处理x-www-form-urlencoded编码
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.set("view engine", "ejs"); // 使用ejs模板引擎
app.use("/uploads", express.static("uploads")); // 配置静态托管路径
// 注册页面渲染
app.get("/register", (req, res) => {
  res.render("register");
});

// 处理注册
app.post("/doregister", async (req, res) => {
  console.log(req.body);
  //   通过姓名查找所有的用户 ,看看这个用户是不是存在
  //   先从数据库中检查一下是否存在此用户名
  const checked = await User.find({ username: req.body.username });
  if (checked.length > 0) {
    // 说明此用户存在
    res.json({
      code: 201,
      msg: "此用户已经存在",
    });
  } else {
    //   插入数据库
    const user = new User(req.body); // 实例化数据
    const result = await user.save();
    if (result) {
      res.json({
        code: 200,
        msg: "注册成功",
      });
    }
  }
});

// 登录页面
app.get("/login", (req, res) => {
  res.render("login");
});
// 检测用户名是否存在
// app.post("/checkusername", async (req, res) => {
//   console.log(req.body.username);
//   const result = await User.find({ username: req.body.username });
//   console.log("result", result);
//   if (result.length > 0) {
//     res.json({
//       code: 200,
//       msg: "可以使用",
//     });
//   } else {
//     res.json({
//       code: 203,
//       msg: "用户名不存在",
//     });
//   }
// });
// 处理登录逻辑
app.post("/dologin", async (req, res) => {
  console.log(req.body);
  //   看看此用户是不是存在，用户名和密码必须都正确才能说明合法
  const result = await User.find(req.body); // 根据用户名和密码查找对应的数据,返回一个数据
  console.log(result instanceof Array); // 看一下result是不是数组
  if (result.length > 0) {
    // 说明找到了，是合法用户
    res.json({
      code: 200,
      msg: "登陆成功",
    });
  } else {
    res.json({
      code: 201,
      msg: "用户名或者密码不正确",
    });
  }
});

// 首页展示
app.get("/", (req, res) => {
  res.send("首页");
});

// 图片上传
app.post("/upload", upload.single("avatar"), function (req, res, next) {
  console.log(req.file);
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.json({
    code: 200,
    msg: "头像上传成功",
    path: req.file.path,
  });
});
app.listen(8888);
