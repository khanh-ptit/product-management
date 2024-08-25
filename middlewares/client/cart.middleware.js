const Cart = require("../../models/cart.model")

module.exports.cartId = async (req, res, next) => {
    try {
        // console.log(req.cookies.cartId)
        if (!req.cookies.cartId) {
            const cart = new Cart()
            const carts = await Cart.find({})
            if (carts.length > 5) {
                return
            }
            await cart.save()

            const expiresTime = 1000 * 86400

            res.cookie("cartId", cart.id, {
                expires: new Date(Date.now() + expiresTime)
            })
            // console.log(cart)
            // res.co
        } else {
            // console.log(req.cookies.cartId)
            const cart = await Cart.findOne({
                _id: req.cookies.cartId
            })
            let totalQuantity = 0
            cart.products.forEach(product => {
                totalQuantity += product.quantity
            })
            // console.log(totalQuantity)
            cart.totalQuantity = totalQuantity
            res.locals.miniCart = cart
            // console.log(cart)
        }
        next()
    } catch {

    }
}