const systemConfig = require('../../config/system')
const ProductCategory = require('../../models/product-category.model')
const filterStatusHelper = require('../../helpers/filterStatus')
const searchHelper = require('../../helpers/search')
const createTreeHelper = require('../../helpers/createTree')

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
        keyword: objectSearch.keyword
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
    const productCategory = new ProductCategory(req.body)
    await productCategory.save()
    req.flash("success", "Thêm thành công sản phẩm")
    res.redirect(`${systemConfig.prefixAdmin}/product-category`)
}

// [PATCH] /admin/product-category/change-multi
module.exports.changeMulti = async (req, res) => {
    // console.log(req.body)
    const ids = req.body.ids.split(", ")
    const type = req.body.type
    switch (type) {
        case "active":
            await ProductCategory.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active"
            })
            break
        case "inactive":
            await ProductCategory.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive"
            })
            break
        case "delete-all":
            await ProductCategory.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: true
            })
            break
        case "change-position":
            for (const item of ids) {
                let [id, pos] = item.split('-')
                pos = parseInt(pos)
                await ProductCategory.updateOne({
                    _id: id
                }, {
                    position: pos
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
        deleted: true
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
        await ProductCategory.updateOne({
            _id: req.params.id
        }, req.body)
        req.flash("success", "Chỉnh sửa thành công sản phẩm")
    } catch (error) {
        // res.redirect("back")
        req.error("error", "Chỉnh sửa thất bại sản phẩm")
        // res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    }
    res.redirect("back")
}