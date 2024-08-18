const systemConfig = require('../../config/system')
const ProductCategory = require('../../models/product-category.model')
const filterStatusHelper = require('../../helpers/filterStatus')
const searchHelper = require('../../helpers/search')
const createTreeHelper = require('../../helpers/createTree')
const Account = require('../../models/account.model')

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
    // console.log(req.query)
    let find = {
        deleted: false
    }
    const filterStatus = filterStatusHelper(req.query)
    // console.log(filterStatus)
    if (req.query.status) {
        find.status = req.query.status
    }
    const accounts = await Account.find({
        deleted: false
    })
    const objectSearch = searchHelper(req.query)
    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    const records = await ProductCategory.find(find)

    const treeRecords = createTreeHelper.tree(records);

    res.render("admin/pages/product-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: treeRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        accounts: accounts
    })
}

// [GET] admin/product-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find)
    const treeRecords = createTreeHelper.tree(records);

    res.render("admin/pages/product-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: treeRecords
    })
}

// [POST] admin/product-category/create
module.exports.createPost = async (req, res) => {
    console.log(req.body)
    if (req.body.position) {
        req.body.position = parseInt(req.body.position)
    } else {
        const productCategoryCount = await ProductCategory.countDocuments()
        req.body.position = productCategoryCount + 1
    }
    req.body.createdBy = {
        account_id: res.locals.user.id,
        createdAt: new Date()
    }
    const productCategory = new ProductCategory(req.body)
    await productCategory.save()
    req.flash("success", "Thêm thành công danh mục sản phẩm")
    res.redirect(`${systemConfig.prefixAdmin}/product-category`)
}

// [PATCH] /admin/product-category/change-multi
module.exports.changeMulti = async (req, res) => {
    // console.log(req.body)
    const ids = req.body.ids.split(", ")
    const type = req.body.type
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    switch (type) {
        case "active":
            await ProductCategory.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active",
                $push: {
                    updatedBy: updatedBy
                }
            })
            break
        case "inactive":
            await ProductCategory.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive",
                $push: {
                    updatedBy: updatedBy
                }
            })
            break
        case "delete-all":
            await ProductCategory.updateMany({
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
            break
        case "change-position":
            for (const item of ids) {
                let [id, pos] = item.split('-')
                pos = parseInt(pos)
                await ProductCategory.updateOne({
                    _id: id
                }, {
                    position: pos,
                    $push: {
                        updatedBy: updatedBy
                    }
                });
            }
            break
        default:
            break
    }

    res.redirect("back")
}

// [DELETE] /admin/product-category/delete:id
module.exports.deleteProductCategory = async (req, res) => {
    console.log(req.params)
    await ProductCategory.updateOne({
        _id: req.params.id
    }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: Date.now()
        }
    })
    req.flash("success", "Đã xóa thành công danh mục sản phẩm")
    res.redirect("back")
}

// [GET] /admin/product-category/edit:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        const record = await ProductCategory.findOne({
            _id: id
        })
        let find = {
            deleted: false
        }

        const records = await ProductCategory.find(find)
        const treeRecords = createTreeHelper.tree(records);
        // const treeRecords = createTreeHelper.tree(record)
        res.render("admin/pages/product-category/edit.pug", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            record: record,
            records: treeRecords
        })
    } catch {
        res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    }
}

// [PATCH] /admin/product-category/edit:id
module.exports.editPatch = async (req, res) => {
    console.log(req.body)
    req.body.position = parseInt(req.body.position)
    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        console.log(updatedBy)
        await ProductCategory.updateOne({
            _id: req.params.id
        }, {
            $set: req.body,
            $push: {
                updatedBy: updatedBy
            }
        })
        req.flash("success", "Chỉnh sửa thành công danh mục sản phẩm")
        // res.redirect("back")
        res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    } catch (error) {
        // res.redirect("back")
        req.error("error", "Chỉnh sửa thất bại sản phẩm")
        res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    }

}

// [GET] /admin/product-category/detail:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const record = await ProductCategory.findOne({
            _id: id
        })
        let parentCategory = null;
        if (record.parent_id) {
            parentCategory = await ProductCategory.findOne({
                _id: record.parent_id
            })
        }
        console.log(record)
        res.render("admin/pages/product-category/detail.pug", {
            pageTitle: record.title,
            record: record,
            parentCategory: parentCategory
        })
    } catch (error) {
        req.flash("error", "Đường dẫn không tồn tại !")
        res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    }
}