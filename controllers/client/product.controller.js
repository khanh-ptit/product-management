const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const productHelper = require("../../helpers/product")
const productCategoryHelper = require("../../helpers/product-category")

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({
        position: "desc"
    })
    // console.log(products)
    const newProducts = productHelper.getNewPrice(products)

    res.render("client/pages/products/index.pug", {
        pageTitle: "Trang danh sách sản phẩm",
        products: newProducts
    })
}


// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    try {
        // console.log(req.params.slugCategory)

        const category = await ProductCategory.findOne({
            slug: req.params.slugCategory
        })



        const listSubCategory = await productCategoryHelper.getSubCategory(category.id)
        const listSubCategoryIds = listSubCategory.map(item => item.id)
        // console.log(listSubCategoryIds)
        // console.log(listSubCategory)
        const products = await Product.find({
            product_category_id: {
                $in: [category.id, ...listSubCategoryIds]
            },
            deleted: false,
            status: "active"
        }).sort({
            position: "desc"
        })
        const newProducts = productHelper.getNewPrice(products)

        res.render("client/pages/products/index.pug", {
            pageTitle: "Trang danh sách sản phẩm",
            products: newProducts,
            pageTitle: category.title
        })
    } catch (error) {

    }
}

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
    try {
        // console.log(req.params.slug)
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        }
        const product = await Product.findOne(find)
        // console.log(product)
        if (product.product_category_id) {
            console.log(product.product_category_id)
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                deleted: false,
                status: "active"
            })
            if (category) {
                product.category = category
            }
        }
        product.priceNew = productHelper.getNewPriceOne(product.price, product.discountPercentage)
        // console.log(product.priceNew)
        res.render("client/pages/products/detail.pug", {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.redirect("/products")
    }

}