const Article = require('../../models/article.model')
const Account = require('../../models/account.model')
const ArticleCategory = require('../../models/article-category.model')
const systemConfig = require('../../config/system')
const treeHelper = require('../../helpers/createTree')
const filterStatusHelper = require('../../helpers/filterStatus')
const formSearchHelper = require('../../helpers/search')

// [GET] admin/articles
module.exports.index = async (req, res) => {
    // Filter status
    let find = {
        deleted: false
    }
    const filterStatus = filterStatusHelper(req.query)
    if (req.query.status) {
        find.status = req.query.status
    }
    // Search
    const objectSearch = formSearchHelper(req.query)
    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }
    // Sort
    const records = await Article.find(find)
    console.log("--------------")
    // Add log create, update
    for (const record of records) {
        if (record.createdBy.account_id) {
            // console.log(record.createdBy.account_id)
            const account = await Account.findOne({
                _id: record.createdBy.account_id,
                deleted: false
            })
            // console.log(account)
            if (account) {
                record.createdAccount = account
            }
        }
    }
    for (const record of records) {
        if (record.updatedBy.length > 0) {
            const account_id = record.updatedBy[record.updatedBy.length - 1].account_id
            console.log(account_id)
            const account = await Account.findOne({
                _id: account_id,
                deleted: false
            })
            if (account) {
                record.updatedAccount = account
            }
        }
    }
    

    res.render("admin/pages/articles/index.pug", {
        pageTitle: "Danh sách bài viết",
        records: records,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    })
}

// [GET] admin/articles/create 
module.exports.create = async (req, res) => {
    const categories = await ArticleCategory.find({
        deleted: false
    })
    const treeCategories = treeHelper.tree(categories)
    res.render("admin/pages/articles/create.pug", {
        pageTitle: "Thêm mới bài viết",
        categories: treeCategories
    })
}

// [POST] admin/articles/create
module.exports.createPost = async (req, res) => {
    const account_id = res.locals.user.id
    req.body.createdBy = {
        account_id: account_id,
        createdAt: new Date()
    }
    const article = new Article(req.body)
    article.save()
    req.flash("success", "Thêm thành công bài viết!")
    res.redirect("back")
}

// [GET] admin/articles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const record = await Article.findOne({
            _id: id,
            deleted: false
        })
        // console.log(record)
        res.render("admin/pages/articles/detail.pug", {
            pageTitle: record.title,
            record: record
        })
    } catch {
        req.flash("error", "Đường dẫn không tồn tại!")
        res.redirect(`${systemConfig.prefixAdmin}/articles`)
    }
}

// [GET] admin/articles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const record = await Article.findOne({
            _id: req.params.id
        })
        let articleCategory
        if (record.article_category_id) {
            articleCategory = await ArticleCategory.findOne({
                _id: record.article_category_id
            })
            record.articleCategory = articleCategory
            // console.log(articleCategory)
        }
        const categories = await ArticleCategory.find({
            deleted: false
        })
        const treeCategories = treeHelper.tree(categories)
        res.render("admin/pages/articles/edit.pug", {
            pageTitle: "Chỉnh sửa bài viết",
            record: record,
            articleCategory: articleCategory,
            categories: treeCategories
        })
    } catch {
        req.flash("error", "Đường dẫn không tồn tại!")
        res.redirect(`${systemConfig.prefixAdmin}/articles`)
    }
}

// [PATCH] admin/articles/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    const account_id = res.locals.user.id
    const updatedBy = {
        account_id: account_id,
        updatedAt: new Date()
    }
    await Article.updateOne({
        _id: id
    }, {
        $set: req.body,
        $push: {
            updatedBy: updatedBy
        }
    })
    req.flash("success", "Cập nhật bài viết thành công!")
    res.redirect(`${systemConfig.prefixAdmin}/articles`)
}

// [DELETE] admin/articles/deleted/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id
    await Article.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    })
    req.flash("success", "Xóa thành công bài viết!")
    res.redirect("back")
}

// [PATCH] admin/articles/change-status/:id/:status
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id
    const account_id = res.locals.user.id
    const updatedBy = {
        account_id: account_id,
        updatedAt: new Date()
    }
    // console.log(updated)
    console.log(id, status)
    await Article.updateOne({
        _id: id
    }, {
        status: status,
        $push: {
            updatedBy: updatedBy
        }
    })
    req.flash("success", "Cập nhật trạng thái thành công!")
    res.redirect("back")
}

// [PATCH] admin/articles/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type
    const ids = req.body.ids.split(", ")
    const account_id = res.locals.user.id
    const updatedBy = {
        account_id: account_id,
        updatedAt: new Date()
    }
    // console.log(updatedBy)
    // console.log(type)
    // console.log(ids)
    switch (type) {
        case "active":
            await Article.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active",
                $push: {
                    updatedBy: updatedBy
                }

            })
            req.flash("success", `Cập nhật trạng thái thành công cho ${ids.length} bài viết`)
            res.redirect("back")
            break
        case "inactive":
            await Article.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive",
                $push: {
                    updatedBy: updatedBy
                }
            })
            req.flash("success", `Cập nhật trạng thái thành công cho ${ids.length} bài viết`)
            res.redirect("back")
            break
        case "delete-all":
            await Article.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: true,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                }
            })
            req.flash("success", `Xoá thành công ${ids.length} bài viết`)
            res.redirect("back")
            break
        default:
            break
    }
}