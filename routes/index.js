const router = require('koa-router')()
const controllers = require('../controllers')

router.get('/', controllers.demo)

router.post('/login', controllers.login)
router.get('/queryPage', controllers.queryPage)

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
