const Koa = require('koa')
const InitManager = require('./core/init')
const parser = require('koa-bodyparser')
const cors = require('@koa/cors');
const views = require('koa-views');
const {resolve} = require('path')
const koaBody = require('koa-body');

const catchError = require('./middlewares/exception')

const app = new Koa()

app.use(views(resolve(__dirname, './views'), {
  extension: 'ejs'
}))
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200*1024*1024,    // 设置上传文件大小最大限制，默认2M
    onFileBegin: (name, file) => {   //文件保存之前的预处理
      file.path = file.name;      //保存文件名改为源文件的文件名，否则文件名随机
    }
  }
}));
app.use(cors())
app.use(catchError)
app.use(parser())

InitManager.initCore(app)

app.listen(5000, () => {
  console.log('Koa is listening in http://localhost:5000')
})

module.exports = app







// const app = new Koa()
// const views = require('koa-views')
// const json = require('koa-json')
// const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
// const logger = require('koa-logger')
//
// const index = require('./routes/index')
// const users = require('./routes/users')
//
// // error handler
// onerror(app)
//
// // middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
// app.use(json())
// app.use(logger())
// app.use(require('koa-static')(__dirname + '/public'))
//
// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))
//
// // logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })
//
// // routes
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
//
// // error-handling
// app.on('error', (err, ctx) => {
//   console.error('server error', err, ctx)
// });
//
// module.exports = app
