const express = require('express')
const router = express.Router()

// const multer = require("multer")
// const upload = multer()

const controller = require("../../controllers/admin/roles.controller")
// const validate = require("../../validates/admin/product.validate")
// const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

router.get('/', controller.index)

router.get('/create', controller.create)

router.get('/permissions', controller.permission)

router.post('/create', controller.createPost)

router.get('/edit/:id', controller.edit)

router.patch('/edit/:id', controller.editPatch)

module.exports = router
