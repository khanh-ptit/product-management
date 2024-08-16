const Account = require('../../models/account.model')
const md5 = require('md5')

// [GET] /admin/my-account
module.exports.index = (req, res) => {
    res.render("admin/pages/my-account/index.pug", {
        pageTitle: "Thông tin tài khoản"
    })
}

// [GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
    res.render("admin/pages/my-account/edit.pug", {
        pageTitle: "Chỉnh sửa tài khoản"
    })
}

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id

    const emailExist = await Account.findOne({
        _id: {
            $ne: id
        }, // Tìm bản ghi có id khác id đã cho
        email: req.body.email,
        deleted: false
    })

    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`)
        res.redirect("back")
        return
    }

    if (req.body.password) {
        req.body.password = md5(req.body.password)
    } else {
        delete req.body.password
    }
    // console.log(req.body)
    await Account.updateOne({
        _id: id
    }, req.body)
    req.flash("success", "Cập nhật tài khoản thành công")
    res.redirect("back")
}