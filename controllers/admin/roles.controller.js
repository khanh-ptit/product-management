const Role = require('../../models/role.model')
const systemConfig = require('../../config/system')

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await Role.find(find)

    res.render("admin/pages/roles/index.pug", {
        pageTitle: "Nhóm quyền",
        records: records
    })
}

// [GET] /admin/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Tạo nhóm quyền"
    })
}

// [POST] /admin/create
module.exports.createPost = async (req, res) => {
    console.log(req.body)
    const role = new Role(req.body)
    role.save()
    req.flash("success", "Thêm thành công nhóm quyền") // Tẹo thêm thông báo
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}