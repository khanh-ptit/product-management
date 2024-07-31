const Product = require('../../models/product.model')

const systemConfig = require("../../config/system")
const filterStatusHelper = require('../../helpers/filterStatus')
const searchHelper = require('../../helpers/search')
const paginationHelper = require('../../helpers/pagination')
// [GET] /admin/products
module.exports.index = async (req, res) => {
    // console.log(req.query.status)
    // Bộ lọc
    const filterStatus = filterStatusHelper(req.query)
    // console.log(filterStatus)

    let find = {
        deleted: false,
        // title: "iPhone 9"
    }
    if (req.query.status) {
        find.status = req.query.status
    }
    const objectSearch = searchHelper(req.query)

    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }


    const countProducts = await Product.countDocuments(find)
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    }, req.query, countProducts)

    const products = await Product.find(find)
        .sort({
            position: "desc"
        })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    console.log(req.params) // { status: 'active', id: '1' }
    const status = req.params.status
    const id = req.params.id

    await Product.updateOne({
        _id: id
    }, {
        status: status
    })

    req.flash("success", "Cập nhật trạng thái thành công")

    res.redirect("back")
}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    // console.log(req)
    // console.log(req.body) // { status: 'active', id: '1' }
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active"
            })
            req.flash("success", `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công`)

            break
        case "inactive":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive"
            })
            req.flash("success", `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công`)
            break
        case "delete-all":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: true,
                deletedAt: new Date()
            })
            req.flash("success", `Xóa ${ids.length} sản phẩm thành công`)
            break
        case "change-position":
            // console.log(ids)
            for (const item of ids) {
                // console.log(item)
                let [id, position] = item.split("-"); // Corrected variable name here
                position = parseInt(position);
                await Product.updateOne({
                    _id: id
                }, {
                    position: position
                })
            }
            req.flash("success", `Cập nhật vị trí cho ${ids.length} sản phẩm thành công`)
            break;
        default:
            break
    }
    res.redirect("back")
}

//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id
    // await Product.deleteOne({_id: id}) Xóa cứng
    await Product.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedAt: new Date()
    })
    req.flash("success", `Xóa sản phẩm thành công`)
    res.redirect("back")
}

module.exports.deleteProducts = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query)
    let find = {
        deleted: true,
    }
    if (req.query.status) {
        find.status = req.query.status
    }
    const objectSearch = searchHelper(req.query)
    // console.log(objectSearch)

    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    // Pagination
    // const objectPagination = paginationHelper(req.query, Product, find)
    const countProducts = await Product.countDocuments(find)
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    }, req.query, countProducts)
    // const deletedProducts = await Product.find({deleted: true})
    const deletedProducts = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)

    res.render("admin/pages/products/deleted-products.pug", {
        products: deletedProducts,
        pageTitle: "Trang sản phẩm đã xóa",
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// [PATCH] /admin/products/restore/:id
module.exports.restoreItem = async (req, res) => {
    // const id = req.params.id
    console.log(req.params)
    await Product.updateOne({
        _id: req.params.id
    }, {
        deleted: false
    })
    req.flash("success", `Khôi phục sản phẩm thành công`)
    res.redirect("back")
}

// [GET] /admin/products/create
module.exports.create = (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm"
    })
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    console.log(req.body)
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    if (req.body.position == '') {
        const countProducts = await Product.countDocuments()
        // console.log(countProducts)
        req.body.position = countProducts + 1
    } else {
        req.body.position = parseInt(req.body.position)
    }
    req.body.thumbnail = `/uploads/${req.file.filename}`
    const product = new Product(req.body)
    await product.save()
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}