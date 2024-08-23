const ArticleCategory = require("../../models/article-category.model")
const Account = require("../../models/account.model")
const systemConfig = require("../../config/system")
const treeHelper = require("../../helpers/createTree")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")

// [GET] /admin/article-category
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

    const records = await ArticleCategory.find(find)
    // Add log create and update
    for (const record of records) {
        const account_id = record.createdBy.account_id
        if (record.createdBy.account_id) {
            const account = await Account.findOne({
                _id: account_id,
                deleted: false
            })
            if (account) {
                record.createdAccount = account
            }
        }
    }
    for (const record of records) {
        if (record.updatedBy.length > 0) {
            const account_id = record.updatedBy[record.updatedBy.length - 1].account_id
            const account = await Account.findOne({
                _id: account_id,
                deleted: false
            })
            if (account) {
                record.updatedAccount = account
            }
        }
    }
    // console.log(account_id)
    // const account = await Account.findOne({
    //     _id: account_id,
    //     deleted: false
    // })

    const treeRecords = treeHelper.tree(records)
    res.render("admin/pages/article-category/index", {
        pageTitle: "Danh mục bài viết",
        records: treeRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    })
}

// [GET] /admin/article-category/create
module.exports.create = async (req, res) => {
    const records = await ArticleCategory.find({
        deleted: false
    })
    const treeRecords = treeHelper.tree(records)
    res.render("admin/pages/article-category/create.pug", {
        pageTitle: "Tạo danh mục bài viết",
        records: treeRecords
    })
}

// [POST] /admin/article-category/create
module.exports.createPost = async (req, res) => {
    console.log(req.body)
    req.body.createdBy = {
        account_id: res.locals.user.id
    }
    const articleCategory = new ArticleCategory(req.body)
    articleCategory.save()
    req.flash("success", "Thêm thành công danh mục bài viết!")
    res.redirect(`${systemConfig.prefixAdmin}/article-category`)
}

// [GET] /admin/article-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        const record = await ArticleCategory.findOne({
            _id: id,
            deleted: false
        })

        const articleCategories = await ArticleCategory.find({
            deleted: false
        })
        const treeCategories = treeHelper.tree(articleCategories)
        // console.log(treeCategories)
        res.render("admin/pages/article-category/edit.pug", {
            pageTitle: "Chỉnh sửa danh mục bài viết",
            record: record,
            treeCategories: treeCategories
        })
    } catch (error) {
        req.flash("error", "Đường dẫn không tồn tại!")
        res.redirect(`${systemConfig.prefixAdmin}/article-category`)
    }
}

// [PATCH] /admin/article-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    await ArticleCategory.updateOne({
        _id: id
    }, {
        $set: req.body,
        $push: {
            updatedBy: updatedBy
        }
    })
    req.flash("success", "Cập nhật thành công danh mục bài viết")
    res.redirect(`${systemConfig.prefixAdmin}/article-category`)
}

// [GET] /admin/article-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const record = await ArticleCategory.findOne({
            _id: id,
            deleted: false
        })
        if (record.parent_id) {
            const parentCategory = await ArticleCategory.findOne({
                _id: record.parent_id
            })
            record.parentCategory = parentCategory
        }
        // res.send("OK")
        // console.log(record)
        res.render("admin/pages/article-category/detail.pug", {
            pageTitle: record.title,
            record: record
        })
    } catch {
        req.flash("error", "Đường dẫn không tồn tại!")
        res.redirect(`${systemConfig.prefixAdmin}/article-category`)
    }
}

// [DELETE] /admin/article-category/deleted/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id
    await ArticleCategory.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    })
    req.flash("success", "Xóa danh mục bài viết thành công!")
    res.redirect(`${systemConfig.prefixAdmin}/article-category`)
}

// [PATCH] /admin/article-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type
    const ids = req.body.ids.split(', ')
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    switch (type) {
        case "active":
            await ArticleCategory.updateMany({
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
            await ArticleCategory.updateMany({
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
            await ArticleCategory.updateMany({
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

// [PATCH] /admin/article-category/change-status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id
    const status = req.params.status
    // console.log(id, status)
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    await ArticleCategory.updateOne({
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