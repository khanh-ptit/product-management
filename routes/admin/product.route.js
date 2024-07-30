const express = require('express')
const router = express.Router()

const controller = require("../../controllers/admin/product.controller")

router.get('/', controller.index)

router.get('/deleted-products', controller.deleteProducts)

router.get('/create', controller.create)

router.post('/create', controller.createPost)

router.patch('/change-status/:status/:id', controller.changeStatus)

router.patch('/change-multi', controller.changeMulti)

router.delete('/delete/:id', controller.deleteItem)

router.patch('/restore/:id', controller.restoreItem)

module.exports = router