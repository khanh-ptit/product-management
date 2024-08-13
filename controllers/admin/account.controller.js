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

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role
    }

    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "Danh sách tài khoản",
        records: records
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