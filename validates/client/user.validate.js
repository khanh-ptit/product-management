module.exports.registerPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Vui lòng nhập họ và tên!")
        res.redirect("back")
        return
    }

    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email!")
        res.redirect("back")
        return
    }

    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập mật khẩu!")
        res.redirect("back")
        return
    }

    if (!req.body.confirm_password) {
        req.flash("error", "Vui lòng xác nhận mật khẩu!")
        res.redirect("back")
        return
    }

    if (req.body.confirm_password != req.body.password) {
        req.flash("error", "Mật khẩu không trùng khớp!")
        res.redirect("back")
        return
    }

    next()
}

module.exports.resetPasswordPost = (req, res, next) => {
    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập mật khẩu!")
        res.redirect("back")
        return
    }

    if (!req.body.confirm_password) {
        req.flash("error", "Vui lòng xác nhận mật khẩu!")
        res.redirect("back")
        return
    }

    if (req.body.confirm_password != req.body.password) {
        req.flash("error", "Mật khẩu không trùng khớp!")
        res.redirect("back")
        return
    }

    next()
}