const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")

// [GET] /cart/
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId
    const cart = await Cart.findOne({
        _id: cartId
    })


    let totalArrayPrice = 0

    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id
            const productInfo = await Product.findOne({
                _id: productId
            })

            if (productInfo) {
                const priceNew = productHelper.getNewPriceOne(productInfo.price, productInfo.discountPercentage)
                productInfo.priceNew = priceNew
                item.productInfo = productInfo
                // console.log(item.productInfo.priceNew, item.quantity)
                item.totalPrice = item.productInfo.priceNew * item.quantity
            }
            totalArrayPrice += item.quantity * item.productInfo.priceNew
        }
        cart.totalArrayPrice = totalArrayPrice
        cart.cartId = cartId
    }
    // console.log(cart)
    res.render("client/pages/cart/index.pug", {
        pageTitle: "Giỏ hàng",
        cart: cart
    })
}

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    const quantity = parseInt(req.body.quantity)

    const cart = await Cart.findOne({
        _id: cartId
    })
    // console.log(cart)
    // console.log(cart.products)

    const existProductInCart = cart.products.find(item => item.product_id == productId)
    // console.log(existProductInCart)

    if (existProductInCart) {
        const newQuantity = quantity + existProductInCart.quantity
        console.log(newQuantity)

        await Cart.updateOne({
            _id: cartId,
            'products.product_id': productId
        }, {
            'products.$.quantity': newQuantity
        })
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }
        console.log(cartId)
        console.log(productId)
        console.log(quantity)

        await Cart.updateOne({
            _id: cartId
        }, {
            $push: {
                products: objectCart
            }
        })
    }

    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công")
    res.redirect("back")
}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const productId = req.params.productId
    const cartId = req.cookies.cartId
    // console.log(cartId, productId)
    const cart = await Cart.findOne({
        _id: cartId
    })
    // console.log(cart)
    // const deletedProduct = cart.products.find(item => item.product_id == productId)
    const indexToDelete = cart.products.findIndex(item => item.product_id == productId)
    console.log(indexToDelete)
    if (indexToDelete != -1 ) {
        cart.products.splice(indexToDelete, 1)
    }
    await cart.save()
    // console.log(cart)
    req.flash("success", "Đã xoá sản phẩm khỏi giỏ hàng")
    res.redirect("back")
}

// [PATCH] /cart/update/:productId/:quantity
module.exports.updateProductQuantity = async (req, res) => {
    const productId = req.params.productId
    const cartId = req.cookies.cartId
    const quantity = req.params.quantity
    console.log(productId, quantity, cartId)
    const cart = await Cart.findOne({
        _id: cartId
    })
    console.log("------------------------")
    const updatedProduct = cart.products.find(item => item.product_id == productId)
    updatedProduct.quantity = quantity
    // console.log(updatedProduct)
    await cart.save()
    res.redirect("back")
}