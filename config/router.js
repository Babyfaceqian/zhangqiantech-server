'use strict'

const Router = require('koa-router')
const User = require('../app/controllers/user')
const App = require('../app/controllers/app')
const Article = require('../app/controllers/article')

module.exports = function () {
  var router = new Router({
    prefix: '/api'
  })

  // user
  // router.post('/u/signup', App.hasBody, User.signup)
  router.post('/u/adduser', App.hasBody, User.addUser)
  // router.post('/u/update', App.hasBody, App.hasToken, User.update)
  router.post('/u/login', App.hasBody, User.login)
  // // DB Interface test
  // router.get('/test/user/users',User.users)
  // router.post('/test/user/add',User.addUser)
  // router.post('/test/user/delete',User.deleteUser)

  // article
  router.post('/article/add', App.hasLogined, App.hasBody, Article.addArticle)
  router.get('/article/list', Article.listArticle)
  router.get('/article/get', Article.getArticle)
  router.post('/article/update', App.hasLogined, App.hasBody, Article.updateArticle)
  router.post('/article/delete', App.hasLogined, App.hasBody, Article.deleteArticle)
  router.post('/article/hide', App.hasLogined, App.hasBody, Article.hideArticle)
  router.get('/article/categoryCount', Article.getCategoryCount)
  return router
}