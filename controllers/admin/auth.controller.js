const Account = require("../../models/account.model")
const md5 = require("md5")
const systemConfig = require("../../config/system")

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
    res.render("admin/pages/auth/login.pug", {
        pageTitle: "Đăng nhập"
    })
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    // console.log(req.body)
    const email = req.body.email
    const password = req.body.password

    const user = await Account.findOne({
        email: email,
        deleted: false
    })
    if (!user) {
        req.flash("error", `Email ${email} không tồn tại !`)
        res.redirect("back")
        return
    }
    console.log(md5(password))
    console.log(user.password)
    if (md5(password) == user.password) {
        if (user.status == "inactive") {
            req.flash("error", "Tài khoản đã bị khóa !")
            res.redirect("back")
            return
        }
        req.flash("success", "Đăng nhập thành công")
        res.cookie("token", user.token)
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
    } else {
        req.flash("error", "Email hoặc mật khẩu không đúng !")
        res.redirect("back")
    }
    // res.send("OK")
}

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie("token")
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
}