const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")
const Order = require("../../models/order.model")

// [GET] /checkout/
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId
    const cart = await Cart.findOne({
        _id: cartId
    })
    // console.log(cart)
    if (cart.products.length > 0) {
        let totalCartPrice = 0
        for (const product of cart.products) {
            const productId = product.product_id
            let productInfo = await Product.findOne({
                _id: productId
            })
            productInfo.priceNew = productHelper.getNewPriceOne(productInfo.price, productInfo.discountPercentage)
            // console.log(productInfo)
            product.productInfo = productInfo
            product.totalPrice = productInfo.priceNew * product.quantity
            // console.log(typeof(productInfo))
            totalCartPrice += product.totalPrice
        }
        cart.totalCartPrice = totalCartPrice
    }
    res.render("client/pages/checkout/index.pug", {
        pageTitle: "Đặt hàng",
        cart: cart
    })
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId
    // console.log(req.body)
    const userInfo = req.body

    const cart = await Cart.findOne({
        _id: cartId
    })

    let products = []
    for (product of cart.products) {
        const objectProduct = {
            quantity: product.quantity,
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0
        }
        const productInfo = await Product.findOne({
            _id: product.product_id
        })
        objectProduct.price = productInfo.price
        objectProduct.discountPercentage = productInfo.discountPercentage
        products.push(objectProduct)
    }

    const objectOrder = {
        cart_id: req.cookies.cartId,
        userInfo: userInfo,
        products: products
    }
    const order = new Order(objectOrder)
    await order.save()

    await Cart.updateOne({
        _id: cartId
    }, {
        products: []
    })

    // console.log(products)
    console.log(objectOrder)
    
    res.redirect(`/checkout/success/${order.id}`)
}

// [GET] /checkout/order/success
module.exports.orderSuccess = async (req, res) => {
    // console.log(req.params.id)

    const order = await Order.findOne({
        _id: req.params.id
    })

    // console.log(order)
    let totalOrderPrice = 0
    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail")      
        product.productInfo = productInfo

        product.priceNew = productHelper.getNewPriceOne(product.price, product.discountPercentage)
        product.totalPrice = product.priceNew * product.quantity
        // console.log(priceNew)
        totalOrderPrice += product.totalPrice
    }
    order.totalOrderPrice = totalOrderPrice
    // order.totalOrderPrice = order.products.reduce((sum, item) => {
    //     sum += item.totalPrice
    // }, 0)

    // console.log(order)

    res.render("client/pages/checkout/success.pug", {
        pageTitle: "Đặt hàng thành công",
        order: order
    })
}