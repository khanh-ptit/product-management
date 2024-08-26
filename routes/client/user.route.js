const express = require("express")
const router = express.Router()

const controller = require("../../controllers/client/user.controller")
const validate = require("../../validates/client/user.validate")

router.get("/register", controller.register)

router.post("/register", validate.registerPost, controller.registerPost)

router.get("/login", controller.login)

router.get("/logout", controller.logout)

router.post("/login", controller.loginPost)

module.exports = router