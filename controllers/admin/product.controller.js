const Product = require('../../models/product.model')

const filterStatusHelper = require('../../helpers/filterStatus')
const searchHelper = require('../../helpers/search')
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
    console.log(objectSearch)
    
    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    // Pagination
    let objectPagination = {
        currentPage: 1,
        limitItems: 4
    }

    if (req.query.page) {
        objectPagination.currentPage = parseInt(req.query.page)
    }

    console.log(objectPagination.currentPage)
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems

    const countProducts = await Product.countDocuments(find)
    // console.log(countProducts)
    const totalPages = Math.ceil(countProducts/objectPagination.limitItems)
    // console.log(totalPages)
    objectPagination.totalPages = totalPages
    // End pagination

    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)
    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}