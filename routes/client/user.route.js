const express = require("express")
const router = express.Router()

const controller = require("../../controllers/client/user.controller")
const validate = require("../../validates/client/user.validate")

router.get("/register", controller.register)

router.post("/register", validate.registerPost, controller.registerPost)

router.get("/login", controller.login)

router.get("/logout", controller.logout)

router.post("/login", controller.loginPost)

router.get("/password/forgot", controller.forgotPassword)

router.post("/password/forgot", controller.forgotPasswordPost)

router.get("/password/otp", controller.otpPassword)

router.post("/password/otp", controller.otpPasswordPost)

router.get("/password/reset", controller.resetPassword)

router.post("/password/reset", validate.resetPasswordPost, controller.resetPasswordPost)

module.exports = router