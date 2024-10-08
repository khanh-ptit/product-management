const Role = require('../../models/role.model')
const Account = require('../../models/account.model')
const systemConfig = require('../../config/system')

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const keyword = req.query.keyword
    if (keyword) {
        const regex = new RegExp(keyword, "i")
        find.title = regex
    }
    const records = await Role.find(find)
    const accounts = await Account.find({
        deleted: false
    })
    res.render("admin/pages/roles/index.pug", {
        pageTitle: "Nhóm quyền",
        records: records,
        accounts: accounts,
        keyword: keyword
    })
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Tạo nhóm quyền"
    })
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    console.log(req.body)
    req.body.createdBy = {
        account_id: res.locals.user.id
    }
    const role = new Role(req.body)
    await role.save()
    req.flash("success", "Thêm thành công nhóm quyền") // Tẹo thêm thông báo
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
    // res.redirect("back")
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        const record = await Role.findOne({
            _id: id,
            deleted: false
        })
        res.render("admin/pages/roles/edit.pug", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            record: record
        })
    } catch (error) {
        req.flash("error", "Đường dẫn không tồn tại")
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }

}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    console.log(req.body)
    const id = req.params.id

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Role.updateOne({
        _id: id
    }, {
        $set: req.body,
        $push: {
            updatedBy: updatedBy
        }
    })
    req.flash("success", "Cập nhật nhóm quyền thành công")
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await Role.find(find)
    // res.send("OK")
    res.render("admin/pages/roles/permissions.pug", {
        pageTitle: "Phân quyền",
        records: records
    })
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    // console.log(req.body)
    try {
        let arr = JSON.parse(req.body.permissions)
        arr.forEach(async element => {
            console.log(element)
            await Role.updateOne({
                _id: element.id
            }, {
                permissions: element.permissions
            })
        });
        req.flash("success", "Cập nhật phân quyền thành công")
        res.redirect("back")
        // res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`)
    } catch (error) {
        req.flash("error", "Cập nhật phân quyền thất bại")
    }
}

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const record = await Role.findOne({
            _id: id
        })
        res.render("admin/pages/roles/detail.pug", {
            pageTitle: record.title,
            record: record
        })
    } catch (error) {
        req.flash("error", "Đường dẫn không tồn tại !")
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }

}

// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id
    await Role.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    })
    req.flash("success", "Xoá thành công danh mục")
    res.redirect("back")
}