module.exports = {
  environment: 'dev',
  database: {
    dbName: 'DedeCms',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Liuabo116!!'
  },
  security: {
    secretKey: "secretKey",
    // 过期时间 1小时
    expiresIn: 60 * 60 * 24
  }
}
