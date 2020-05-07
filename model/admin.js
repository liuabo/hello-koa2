const sequelize = require('../my-sequelize')
const Sequelize = require('sequelize')

const admin = sequelize.define('admin', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  openid: {
    type: Sequelize.STRING,
    unique: {
      msg: '已添加'
    }
  },
  session_key: {
    type: Sequelize.STRING
  }
}, {freezeTableName: true})

module.exports = admin
