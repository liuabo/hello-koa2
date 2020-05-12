/**
 * @description 管理员的路由 API 接口
 * @description Administrator's routing API interface
 * @author 刘博
 */

const Router = require('koa-router')
const fs = require('fs')
const path = require('path')

const {
  RegisterValidator,
  AdminLoginValidator,
  AdminUpdateValidator
} = require('../../validators/admin')

const {AdminDao} = require('../../dao/admin');
const {Auth} = require('../../../middlewares/auth');
const {LoginManager} = require('../../service/login');
const {Resolve} = require('../../lib/helper');
const res = new Resolve();

const AUTH_ADMIN = 16;

const router = new Router({
  prefix: '/api/v1/admin'
})

// 管理员注册
router.post('/register', async (ctx) => {

  // 通过验证器校验参数是否通过
  const v = await new RegisterValidator().validate(ctx);

  // 创建管理员
  const admin = await AdminDao.create({
    email: v.get('body.email'),
    password: v.get('body.password2'),
    nickname: v.get('body.nickname')
  });

  // 返回结果
  ctx.response.status = 200;
  ctx.body = res.json(admin);
})

// 管理登录
router.post('/login', async (ctx) => {

  const v = await new AdminLoginValidator().validate(ctx);

  let token = await LoginManager.adminLogin({
    email: v.get('body.email'),
    password: v.get('body.password')
  });

  const data = 'Basic ' +  new Buffer(token + ':').toString('base64');
  ctx.response.status = 200;
  ctx.body = {
    code: 200,
    msg: '登录成功',
    token: data
  }
});

// 获取用户信息
router.get('/auth', new Auth(AUTH_ADMIN).m, async (ctx) => {

  // 获取用户ID
  const id = ctx.auth.uid;

  // 查询用户信息
  let userInfo = await AdminDao.detail(id);

  // 返回结果
  ctx.response.status = 200;
  ctx.body = res.json(userInfo)
})

// 修改广告
router.put('/edit', new Auth(AUTH_ADMIN).m, async (ctx) => {

  // 通过验证器校验参数是否通过
  const v = await new AdminUpdateValidator().validate(ctx);

  // 获取广告ID参数
  const id = v.get('body.id');
  await AdminDao.update(id, v);

  // 返回结果
  ctx.response.status = 200;
  ctx.body = res.success('更新个人信息成功')
})


router.post('/uploadfile', async (ctx) => {
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = path.join('./public/images/') + `/${file.name}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  return ctx.body = "上传成功！";
});

module.exports = router
