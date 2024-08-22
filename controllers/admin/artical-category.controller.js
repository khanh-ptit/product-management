const ArticalCategory = require("../../models/article-category.model")
const Account = require("../../models/account.model")
const systemConfig = require("../../config/system")
const treeHelper = require("../../helpers/createTree")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")

// [GET] /admin/artical-category
module.exports.index = async (req, res) => {
    // Bộ lọc
    const filterStatus = filterStatusHelper(req.query)
    let find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status
    }

    // Tìm kiếm
    const objectSearch = searchHelper(req.query)
    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    const records = await ArticalCategory.find(find)
    const account_id = res.locals.user.id
    console.log(account_id)
    const account = await Account.findOne({
        _id: account_id,
        deleted: false
    })

    const treeRecords = treeHelper.tree(records)
    res.render("admin/pages/artical-category/index", {
        pageTitle: "Danh mục bài viết",
        records: treeRecords,
        account: account,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    })
}

// [GET] /admin/artical-category/create
module.exports.create = async (req, res) => {
    const records = await ArticalCategory.find({
        deleted: false
    })
    const treeRecords = treeHelper.tree(records)
    res.render("admin/pages/artical-category/create.pug", {
        pageTitle: "Tạo danh mục bài viết",
        records: treeRecords
    })
}

// [POST] /admin/artical-category/create
module.exports.createPost = async (req, res) => {
    console.log(req.body)
    req.body.createdBy = {
        account_id: res.locals.user.id
    }
    const articalCategory = new ArticalCategory(req.body)
    articalCategory.save()
    req.flash("success", "Thêm thành công danh mục bài viết!")
    res.redirect(`${systemConfig.prefixAdmin}/artical-category`)
}

// [GET] /admin/artical-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        const record = await ArticalCategory.findOne({
            _id: id,
            deleted: false
        })

        const articalCategories = await ArticalCategory.find({
            deleted: false
        })
        const treeCategories = treeHelper.tree(articalCategories)
        // console.log(treeCategories)
        res.render("admin/pages/artical-category/edit.pug", {
            pageTitle: "Chỉnh sửa danh mục bài viết",
            record: record,
            treeCategories: treeCategories
        })
    } catch (error) {
        req.flash("error", "Đường dẫn không tồn tại!")
        res.redirect(`${systemConfig.prefixAdmin}/artical-category`)
    }
}

// [PATCH] /admin/artical-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    await ArticalCategory.updateOne({
        _id: id
    }, {
        $set: req.body,
        $push: {
            updatedBy: updatedBy
        }
    })
    req.flash("success", "Cập nhật thành công danh mục bài viết")
    res.redirect(`${systemConfig.prefixAdmin}/artical-category`)
}

// [GET] /admin/artical-category/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id
    const record = await ArticalCategory.findOne({
        _id: id,
        deleted: false
    })
    if (record.parent_id) {
        const parentCategory = await ArticalCategory.findOne({
            _id: record.parent_id
        })
        record.parentCategory = parentCategory
    }
    // res.send("OK")
    // console.log(record)
    res.render("admin/pages/artical-category/detail.pug", {
        pageTitle: record.title,
        record: record
    })
}

// [DELETE] /admin/artical-category/deleted/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id
    await ArticalCategory.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    })
    req.flash("success", "Xóa danh mục bài viết thành công!")
    res.redirect(`${systemConfig.prefixAdmin}/artical-category`)
}

// [PATCH] /admin/artical-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type
    const ids = req.body.ids.split(', ')
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    switch (type) {
        case "active":
            await ArticalCategory.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active",
                $push: {
                    updatedBy: updatedBy
                }
            })
            req.flash("success", `Cập nhật trạng thái thành công cho ${ids.length} danh mục`)
            break
        case "inactive":
            await ArticalCategory.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive",
                $push: {
                    updatedBy: updatedBy
                }
            })
            req.flash("success", `Cập nhật trạng thái thành công cho ${ids.length} danh mục`)
            break
        case "delete-all":
            await ArticalCategory.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: false,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                }
            })
            req.flash("success", `Xoá thành công cho ${ids.length} danh mục`)
            break
        default:
            break

    }

    res.redirect("back")
}

// [PATCH] /admin/artical-category/change-status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id
    const status = req.params.status
    // console.log(id, status)
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    await ArticalCategory.updateOne({
        _id: id
    }, {
        status: status,
        $push: {
            updatedBy: updatedBy
        }
    })
    req.flash("success", `Cập nhật trạng thái thành công cho sản phẩm!`)
    res.redirect("back")
}