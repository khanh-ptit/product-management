const dashboardRoutes = require("./dashboard.route")
const productRoutes = require("./product.route")
const productCategoryRoutes = require("./product-category.route")
const rolesRoutes = require("./role.route")
const accountRoutes = require("./account.route")
const authRoutes = require("./auth.route")
const myAccountRoutes = require("./my-account.route")
const articleCategoryRoutes = require("./article-category.route")
const articleRoutes = require("./article.route")
const settingRoutes = require("./setting.route")

const authMiddleware = require("../../middlewares/admin/auth.middleware")

const systemConfig = require("../../config/system")

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin

    app.use(PATH_ADMIN + '/dashboard', authMiddleware.requireAuth, dashboardRoutes)
    app.use(PATH_ADMIN + '/products', authMiddleware.requireAuth, productRoutes)
    app.use(PATH_ADMIN + '/product-category', authMiddleware.requireAuth, productCategoryRoutes)
    app.use(PATH_ADMIN + '/roles', authMiddleware.requireAuth, rolesRoutes)
    app.use(PATH_ADMIN + '/accounts', authMiddleware.requireAuth, accountRoutes)
    app.use(PATH_ADMIN + '/auth', authRoutes)
    app.use(PATH_ADMIN + '/my-account', authMiddleware.requireAuth, myAccountRoutes)
    app.use(PATH_ADMIN + '/article-category', authMiddleware.requireAuth, articleCategoryRoutes)
    app.use(PATH_ADMIN + '/articles', authMiddleware.requireAuth, articleRoutes)
    app.use(PATH_ADMIN + '/settings', authMiddleware.requireAuth, settingRoutes)

}