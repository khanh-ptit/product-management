const Account = require("../../models/account.model")
const Role = require("../../models/role.model")
const systemConfig = require("../../config/system")
const md5 = require("md5")

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await Account.find(find).select("-password -token")

    const roles = await Role.find({
        deleted: false
    })

    // for (const record of records) {
    //     const role = await Role.findOne({
    //         _id: record.role_id,
    //         deleted: false
    //     })
    //     if (role) {
    //         record.role = role
    //     } else {
    //         record.role = "Không có nhóm quyền"
    //     }
    // }

    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "Danh sách tài khoản",
        records: records,
        recordRoles: roles
    })
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    })
    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Tạo tài khoản",
        roles: roles
    })
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    try {
        const emailExist = await Account.findOne({
            email: req.body.email,
            deleted: false
        })

        if (emailExist) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`)
            res.redirect("back")
        } else {
            req.body.password = md5(req.body.password)
            const account = new Account(req.body)
            account.save()
            req.flash("success", "Tạo tài khoản thành công!")
            res.redirect(`${systemConfig.prefixAdmin}/accounts`)
        }
    } catch (error) {

    }

}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        const roles = await Role.find({
            deleted: false
        })
        const record = await Account.findOne({
            _id: id
        })
        res.render("admin/pages/accounts/edit.pug", {
            pageTitle: "Chỉnh sửa tài khoản",
            record: record,
            roles: roles
        })
    } catch {
        req.flash("error", "Đường dẫn không tồn tại!")
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }

}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id

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
        console.log(req.body)
        await Account.updateOne({
            _id: id
        }, req.body)
        req.flash("success", "Cập nhật tài khoản thành công")
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    } catch {
        req.flash("error", "Đường dẫn không tồn tại!")
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

// [GET] /admin/accounts/details/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const record = await Account.findOne({
            _id: id
        }).select("-password")
        const roles = await Role.find({
            deleted: false
        })
        res.render("admin/pages/accounts/detail.pug", {
            pageTitle: "Chi tiết tài khoản",
            record: record,
            roles: roles
        })
    } catch (error) {
        req.flash("error", "Đường dẫn không tồn tại !")
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

// [DELETE] /admin/account/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id
    await Account.updateOne({
        _id: id
    }, {
        deleted: true
    })
    req.flash("success", "Xoá thành công tài khoản!")
    res.redirect(`${systemConfig.prefixAdmin}/accounts`)
}