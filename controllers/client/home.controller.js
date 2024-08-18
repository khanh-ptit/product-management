const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")

// [GET] /
module.exports.index = async (req, res) => {
    const featuredProducts = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    })

    const newProducts = productHelper.getNewPrice(featuredProducts)

    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        featuredProducts: newProducts
    })
}