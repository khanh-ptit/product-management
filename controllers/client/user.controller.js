const User = require("../../models/user.model")
const Cart = require("../../models/cart.model")
const ForgotPassword = require("../../models/forgot-password.model")
const md5 = require("md5")
const generateHelper = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/sendMail")

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
            // console.log("*")
            await User.updateOne({
                _id: user.id
            }, {
                statusOnline: "online"
            })
            _io.once("connection", (socket) => {
                socket.broadcast.emit("SERVER_RETURN_LOGIN_SUCCESSFULLY", {
                    user_id: user.id
                })
            })
            console.log(user.tokenUser)
            res.cookie("tokenUser", user.tokenUser)
            // res.cookie("user_id", user._id)

            // Lưu user_id vào collection carts
            // console.log(user.id, req.cookies.cartId)
            await Cart.updateOne({
                _id: req.cookies.cartId
            }, {
                user_id: user.id
            })
            res.redirect("/")
        } else {
            req.flash("error", "Email hoặc mật khẩu không đúng")
            res.redirect("back")
        }
        // res.send("OK")
    }
}

// [GET] user/logout
module.exports.logout = async (req, res) => {
    await User.updateOne({
        _id: res.locals.user.id
    }, {
        statusOnline: "offline"
    })
    _io.once("connection", (socket) => {
        socket.broadcast.emit("SERVER_RETURN_LOGOUT_SUCCESSFULLY", {
            user_id: res.locals.user.id
        })
    })
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

    // Việc 2: Gửi OTP qua email của user
    const subject = `Mã xác thực OTP đặt lại mật khẩu`
    const html = `
        Mã OTP lấy lại mật khẩu là <b>${otp}</b>. Lưu ý không được chia sẻ mã này. Thời hạn sử dụng là 3 phút.
    `

    sendMailHelper.sendMail(email, subject, html)

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

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đặt lại mật khẩu"
    })
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser
    // const user = await User.findOne({
    //     tokenUser: tokenUser
    // })
    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    })
    req.flash("success", "Đổi mật khẩu thành công")
    res.redirect("/")
}

// [GET] /user/info
module.exports.info = async (req, res) => {

    res.render("client/pages/user/info.pug", {
        pageTitle: "Tài khoản"
    })
}