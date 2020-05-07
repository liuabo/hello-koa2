// 登录授权接口
const Tag = require('../model/admin')
const Op = require('sequelize').Op
const koaRequest = require('koa2-request')  //koa封装的请求第三方接口的方法
const JwtUtil = require('../utils/jwt')

const cookieConfig = {
    maxAge: 1000 * 60 * 3,            // 一个数字表示从 Date.now() 得到的毫秒数
    expires: new Date('2019-03-08'),        // 过期的 Date,如不设置就和session类似，关闭浏览器此cookie失效
    path: '/',                  // 路径, 默认是'/'
    domain: 'localhost',                // 域名
    secure: false,              // 安全 cookie   默认false，设置成true表示只有 https可以访问
    httpOnly: false,            // 是否只是服务器可访问 cookie, 默认是 true
    overwrite: true             // 一个布尔值，表示是否覆盖以前设置的同名的 cookie (默认是 false). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie（不管路径或域）是否在设置此Cookie 时从 Set-Cookie 标头中过滤掉。
}

module.exports = async (ctx, next) => {
    const user = ctx.request.body
    //koa封装的请求第三方接口的方法(koa2-request)
    let data = await koaRequest({
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        method: 'get',
        qs: {
            appid: 'wx2132f3afc6974b18',
            secret: '66d54652fc85a9d63ba6cb2095bdc4ef',
            js_code: user.code,
            grant_type: 'authorization_code'
        }
    });
    if (data.statusCode === 200) {
        // return;
        let body = JSON.parse(data.body)
        console.log('body', body);
        const res = await Tag.findOne({
            where: {
                openid: body.openid
            }
        })
        console.log('获取', res);
        // 登陆成功，添加token验证
        let _id = body.openid.toString();
        // 将用户id传入并生成token
        let jwt = new JwtUtil(_id);
        let token = jwt.generateToken();
        // ctx.cookies.set('token', token, {cookieConfig});
        // 将 token 返回给客户端
        // res.send({status:200,msg:'登陆成功',token:token});
        ctx.body = {
            res
            // code: res ? 200 : res,
            // data: token,
            // desc: res ? '登陆成功' : '账号或密码错误'
        }
    }
    //node封装的请求中间件POST请求(request)
    // await koaRequest({
    //         url: 'http://rental.heyhat.cn/agentOrder/user_info_list',
    //         method: 'post',
    //         form: resData,
    //         json: true//设置返回的数据为json
    //     },
    //     function (err,res,body) {
    //         if (!err && res.statusCode == 200) {
    //             console.log(body)
    //         }
    //     })
    // await next()
}
