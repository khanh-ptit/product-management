const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helpers/createTree")

// [GET] /
module.exports.index = async (req, res) => {
    const productCategories = await ProductCategory.find({
        deleted: false
    })

    const treeProductCategories = createTreeHelper.tree(productCategories)
    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        layoutProductCategories: treeProductCategories
    })
}