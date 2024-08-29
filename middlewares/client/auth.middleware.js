const User = require("../../models/user.model")

module.exports.requireAuth = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser
    if (!req.cookies.tokenUser) {
        res.redirect("/user/login")
        return
    }
    // const user = await User.findOne({
    //     tokenUser: tokenUser
    // })
    // if (user) {
    //     console.log(user)
    // }
    next()
}