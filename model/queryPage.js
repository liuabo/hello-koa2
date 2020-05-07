const sequelize = require('../my-sequelize')
const Sequelize = require('sequelize')

const queryPage = sequelize.define('videoList', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    unique: {
      msg: '已添加'
    }
  },
  url: {
    type: Sequelize.STRING
  }
}, {freezeTableName: true})

module.exports = queryPage
