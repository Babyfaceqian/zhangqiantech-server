'use strict'

var mongoose = require('mongoose')
var Session = mongoose.model('Session')

exports.findSessionByKey = async (key) => {
  var query = Session.findOne({
    key
  })
  var res = null
  await query.exec(function (err, session) {
    if (err) {
      res = {}
    } else {
      res = session
    }
  })
  // console.log('res====>' + res)
  return res;
}

exports.setSession = async (key, session) => {
  let data = new Session({
    key,
    session
  })
  console.log('appHelper setSession', data)
  try {
    data = await data.save()
    return data;
  } catch (e) {
    return null;
  }
}

exports.deleteSession = async (key) => {
  try {
    Session.remove({
      key
    })
  } catch (e) {
    console.log('err', e)
  }
}