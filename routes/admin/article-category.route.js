const express = require('express')
const router = express.Router()

const controller = require('../../controllers/admin/article-category.controller')
const validate = require('../../validates/admin/article-category.validate')

router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create', validate.createPost, controller.createPost)

router.get('/edit/:id', controller.edit)

router.patch('/edit/:id', controller.editPatch)

router.get('/detail/:id', controller.detail)

router.patch('/delete/:id', controller.delete)

router.patch('/change-multi', controller.changeMulti)

router.patch('/change-status/:id/:status', controller.changeStatus)

module.exports = router