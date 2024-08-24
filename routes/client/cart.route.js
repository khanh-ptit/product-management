const express = require("express")
const router = express.Router()

const controller = require('../../controllers/client/cart.controller')

router.post('/add/:productId', controller.addPost)

router.get('/delete/:productId', controller.delete)

router.get('/', controller.index)

module.exports = router