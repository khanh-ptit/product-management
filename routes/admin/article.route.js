const express = require('express')
const router = express.Router()

const controller = require('../../controllers/admin/article.controller')
const validate = require('../../validates/admin/article.validate')

router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create', validate.createPost, controller.createPost)

router.get('/detail/:id', controller.detail)

router.get('/edit/:id', controller.edit)

router.patch('/edit/:id', validate.editPatch, controller.editPatch)

router.patch('/delete/:id', controller.delete)

router.patch('/change-status/:id/:status', controller.changeStatus)

router.patch('/change-multi', controller.changeMulti)

module.exports = router