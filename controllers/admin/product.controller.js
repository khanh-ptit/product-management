const Product = require('../../models/product.model')

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

    // Tìm kiếm
    // let keyword = ""
    // if (req.query.keyword) {
    //     keyword = req.query.keyword

    //     const regex = new RegExp(keyword, "i")
    //     find.title = regex
    // }
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

    // if (req.query.page) {
    //     objectPagination.currentPage = parseInt(req.query.page)
    // }

    // console.log(objectPagination.currentPage)
    // objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems

    // const countProducts = await Product.countDocuments(find)
    // // console.log(countProducts)
    // const totalPages = Math.ceil(countProducts/objectPagination.limitItems)
    // // console.log(totalPages)
    // objectPagination.totalPages = totalPages
    // // End pagination

    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)
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

    res.redirect("back")
}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    // console.log(req)
    // console.log(req.body) // { status: 'active', id: '1' }
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    if (type === "active" || type === "inactive") {
        await Product.updateMany({
            _id: {
                $in: ids
            }
        }, {
            $set: {
                status: type
            }
        });
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

    res.redirect("back")
}

module.exports.deleteProducts = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query)
    // console.log(filterStatus)

    let find = {
        deleted: true,
        // title: "iPhone 9"
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
    await Product.updateOne({_id: req.params.id}, {deleted: false})
    res.redirect("back")
}