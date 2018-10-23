'use strict'

var xss = require('xss')
var mongoose = require('mongoose')
import User from '../models/user';
var uuid = require('uuid')
// var userHelper = require('../dbhelper/userHelper')
import userHelper from '../dbhelper/userHelper'

/**
 * 数据库接口测试
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.users = async (ctx, next) => {
  var data = await userHelper.findAllUsers()
  ctx.body = {
    success: true,
    data
  }
}
exports.addUser = async (ctx, next) => {
  let username = ctx.request.body.username;
  let pwd = ctx.request.body.pwd;
  var user = new User({
    username,
    pwd
  })
  var result = await userHelper.addUser(user)
  if (result) {
    ctx.body = {
      success: true,
      message: "添加成功！"
    }
  } else {
    ctx.body = {
      success: false,
      message: '添加失败！'
    }
  }
}

/**
 * 登录
 */
exports.login = async (ctx, next) => {
  let username = ctx.request.body.username
  let pwd = ctx.request.body.pwd
  let user = {
    username,
    pwd
  }
  let result = await userHelper.findByUsernameAndPwd(user)
  if (result) {
    ctx.session.user = username
    ctx.body = {
      success: true,
      message: '登录成功！'
    }
    await next()
  } else {
    ctx.body = {
      success: false,
      message: '用户名或密码错误！'
    }
  }
}