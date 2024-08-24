const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")

// [GET] /
module.exports.index = async (req, res) => {
    // Getting featured products
    const featuredProducts = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    })

    const newProducts = productHelper.getNewPrice(featuredProducts)
    // End getting featured products

    // Getting lastest products
    const latestProductsWithoutNewPrice = await Product.find({
        deleted: false,
        status: "active"
    }).limit(6).sort({
        position: "desc"
    })
    const latestProducts = productHelper.getNewPrice(latestProductsWithoutNewPrice)
    // End getting lastest products

    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        featuredProducts: newProducts,
        latestProducts: latestProducts
    })
}