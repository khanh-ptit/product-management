const systemConfig = require('../../config/system')
const ProductCategory = require('../../models/product-category.model')
const filterStatusHelper = require('../../helpers/filterStatus')

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
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i")
        find.title = regex
    }
    
    const records = await ProductCategory.find(find)
    res.render("admin/pages/product-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: records,
        filterStatus: filterStatus
    })
}

module.exports.create = (req, res) => {
    res.render("admin/pages/product-category/create", {
        pageTitle: "Tạo danh mục sản phẩm"
    })
}

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