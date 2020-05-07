const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const JwtUtil = require('./utils/jwt')
// const response = require('./middlewares/response')
const cors = require('koa-cors');

const router = require('./routes/index')

// error handler
onerror(app)

// middlewares
app.use(bodyParser({
  enableTypes:['json', 'form', 'text']
}))

app.use(async (ctx, next) => {
  if (ctx.originalUrl != '/login' && ctx.originalUrl != '/user/register') {
    console.log(ctx)
    let token = ctx.cookies.get('token')
    let jwt = new JwtUtil(token);
    let result = jwt.verifyToken();
    if (result == 'err') {
      console.log(result);
      ctx.body = {status: 403, msg: '登录已过期,请重新登录'}
      // ctx.send({status: 403, msg: '登录已过期,请重新登录'});
      // res.render('login.html');
    }
    await next();
  } else {
    await next();
  }
})


app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 使用响应处理中间件
// app.use(response)

// 解析请求体
app.use(bodyParser())

// routes
app.use(router.routes())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
