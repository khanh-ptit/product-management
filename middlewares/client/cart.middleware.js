const Cart = require("../../models/cart.model")

module.exports.cartId = async (req, res, next) => {
    // console.log(req.cookies.cartId)
    if (!req.cookies.cartId) {
        const cart = new Cart()
        await cart.save()

        const expiresTime = 1000 * 86400

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        })
        // console.log(cart)
        // res.co
    } else {
        // console.log(req.cookies.cartId)
    }
    next()
}