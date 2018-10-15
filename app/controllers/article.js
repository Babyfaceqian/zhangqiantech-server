'use strict'

var mongoose = require('mongoose')
var uuid = require('uuid')
var xss = require('xss');
import _ from 'lodash';
import Article from '../models/article';
import moment from 'moment';

exports.addArticle = async (ctx, next) => {
  let body = ctx.request.body
  let article = new Article({
    title: xss(body.title),
    subTitle: xss(body.subTitle),
    category: xss(body.category),
    summary: xss(body.summary),
    content: xss(body.content)
  })

  try {
    article = await article.save()
    ctx.body = {
      success: true
    }
    await next()
  } catch (e) {
    ctx.body = {
      succcess: false
    }
    return next
  }
}

exports.updateArticle = async (ctx, next) => {
  let body = ctx.request.body
  let article = await Article.findOne({
    _id: body._id
  }).exec()
  if (!article) {
    ctx.body = {
      success: false,
      message: '该文章不存在'
    }
  } else {
    let fields = 'title,subTitle,summary,category,content'.split(',')

    fields.forEach((field) => {
      if (body[field]) {
        article[field] = xss(body[field].trim())
      }
    })

    article = await article.save()
    ctx.body = {
      success: true,
      data: {
        title: article.title,
        subTitle: article.subTitle,
        summary: article.summary,
        author: article.author,
        category: article.category,
        content: article.content,
        _id: article._id
      }
    }
  }
}

exports.listArticle = async (ctx, next) => {
  let category = ctx.query.category;
  let query = {
    'meta.isHide': false
  }
  if (category) {
    query.category = category;
  }
  let list = await Article.find(query).exec()
  list = list.map((it) => {
    return {
      _id: it._id,
      title: it.title,
      subTitle: it.subTitle,
      author: it.author,
      category: it.category,
      summary: it.summary,
      createAt: moment(it.meta.createAt).format('YYYY-MM-DD HH:mm:ss'),
      updateAt: moment(it.meta.updateAt).format('YYYY-MM-DD HH:mm:ss')
    }
  })
  list.sort((prev, next) => {
    return moment(prev.createAt) < moment(next.createAt)
  })
  ctx.body = {
    success: true,
    data: list
  }
}

exports.getArticle = async (ctx, next) => {
  let _id = ctx.query._id
  let article = await Article.findOne({
    _id: _id
  }).exec()
  article = {
    _id: article._id,
    title: article.title,
    subTitle: article.subTitle,
    author: article.author,
    summary: article.summary,
    category: article.category,
    content: article.content,
    createAt: moment(article.meta.createAt).format('YYYY-MM-DD HH:mm:ss'),
    updateAt: moment(article.meta.updateAt).format('YYYY-MM-DD HH:mm:ss')
  }
  ctx.body = {
    success: true,
    data: article
  }
}

exports.deleteArticle = async (ctx, next) => {
  let _id = ctx.request.body._id
  try {
    await Article.findOne({
      _id: _id
    }).remove().exec()
    ctx.body = {
      success: true
    }
  } catch (e) {
    ctx.body = {
      success: false
    }
  }
}

exports.hideArticle = async (ctx, next) => {
  let _id = ctx.request.body._id
  try {
    let article = await Article.findOne({
      _id: _id
    }).exec()
    article.meta.isHide = true
    await article.save()
    ctx.body = {
      success: true
    }
  } catch (e) {
    ctx.body = {
      success: false
    }
  }
}

exports.getCategoryCount = async (ctx, next) => {
  let query = {
    'meta.isHide': false
  }
  let list = await Article.find(query).exec()
  let allCategories = list.map((it) => it.category)
  let categoryCount = _.countBy(allCategories)
  ctx.body = {
    success: true,
    data: categoryCount
  }
}