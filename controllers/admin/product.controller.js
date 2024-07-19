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

    const products = await Product.find(find)
    // console.log(products)
    // res.send("Trang sản phẩm")
    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    })
}