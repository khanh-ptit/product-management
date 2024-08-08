const express = require('express')
const router = express.Router()

// const multer = require("multer")
// const upload = multer()

const controller = require("../../controllers/admin/roles.controller")
// const validate = require("../../validates/admin/product.validate")
// const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

router.get('/', controller.index)

router.get('/create', controller.create)

router.get('/permissions', controller.permissions)

router.post('/create', controller.createPost)

router.get('/edit/:id', controller.edit)

router.get('/detail/:id', controller.detail)

router.patch('/edit/:id', controller.editPatch)

router.patch('/permissions', controller.permissionsPatch)

router.patch('/delete/:id', controller.delete)

module.exports = router