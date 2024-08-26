const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")
const md5 = require("md5")
const generateHelper = require("../../helpers/generate")

// [GET] user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản"
    })
}

// [POST] user/register
module.exports.registerPost = async (req, res) => {
    // console.log(req.body) 
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    if (existEmail) {
        req.flash("error", `Email ${req.body.email} đã tồn tại.`)
        res.redirect("back")
    }

    req.body.password = md5(req.body.password)
    const user = new User(req.body)
    await user.save()

    res.cookie("tokenUser", user.tokenUser)

    res.redirect("/")
}

// [GET] user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login.pug", {
        pageTitle: "Đăng nhập tài khoản"
    })
}

// [POST] user/login
module.exports.loginPost = async (req, res) => {
    // console.log(req.body)
    const user = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    // console.log(user)
    // res.send("OK")
    if (!user) {
        req.flash("error", "Email chưa được đăng ký")
        res.redirect("back")
    } else {
        const password = req.body.password
        if (md5(password) == user.password) {
            if (user.status == "inactive") {
                req.flash("error", "Tài khoản tạm thời bị khóa!")
                res.redirect("back")
                return
            }
            console.log("*")
            console.log(user.tokenUser)
            res.cookie("tokenUser", user.tokenUser)
            res.redirect("/")
        } else {
            req.flash("error", "Email hoặc mật khẩu không đúng")
            res.redirect("back")
        }
        // res.send("OK")
    }
}

// [GET] user/login
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")
    res.redirect("back")
}

// [GET] user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password.pug", {
        pageTitle: "Lấy lại mật khẩu"
    })
}

// [POST] user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        req.flash("error", "Email chưa được đăng ký!")
        res.redirect("back")
        return
    }

    // Việc 1: Tạo mã OTP và lưu OTP, email vào collection forgot-password
    const otp = generateHelper.generateRandomNumber(8)

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

    console.log(objectForgotPassword)

    res.redirect(`/user/password/otp?email=${email}`)
}

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email
    // console.log(email)
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email
    })
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp
    const record = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if (!record) {
        req.flash("error", "OTP không hợp lệ!")
        res.redirect("back")
        return
    }
    const user = await User.findOne({
        email: email
    })
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/user/password/reset")
}