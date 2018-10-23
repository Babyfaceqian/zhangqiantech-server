'use strict'

// 用于封装controllers的公共方法

var mongoose = require('mongoose')
var uuid = require('uuid')
var User = mongoose.model('User')
var appHelper = require('../dbhelper/appHelper');

const getSession = async (key) => {
  console.log('controller getSession')
  let session = appHelper.findSessionByKey(key);
  return session
}

exports.getSession = getSession;

exports.setSession = async (key, sess) => {
  console.log('controller setSession')
  appHelper.setSession(key, sess)
}

exports.deleteSession = async (key) => {
  console.log('delete session')
  appHelper.deleteSession(key)
}

exports.hasBody = async (ctx, next) => {
  var body = ctx.request.body || {}
  console.log('body', body)
  console.log(body)

  if (Object.keys(body).length === 0) {
    ctx.body = {
      success: false,
      err: '某参数缺失'
    }

    return next
  }

  await next()
}

// 检验token
exports.hasLogined = async (ctx, next) => {
  var sid = ctx.cookies.get('koa:sess')
  if (!sid) {
    ctx.body = {
      success: false,
      status: 3,
      message: '请登录！'
    }
  } else {
    let sessionStr = await getSession(sid)
    if (sessionStr) {
      console.log('sessionStr', sessionStr, JSON);
      let session = JSON.parse(sessionStr)
      console.log('hasLogined session', session)
      let { _maxAge, _expired } = session
      if ((new Date()).getTime() - _expired > _maxAge) {
        ctx.body = {
          success: false,
          status: 3,
          message: '请重新登录！'
        }
      } else {
        await next()
      }
    } else {
      ctx.body = {
        success: false,
        status: 3,
        message: '请登录！'
      }
    }
  }
}
