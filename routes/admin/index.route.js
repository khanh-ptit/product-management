const dashboardRoutes = require("./dashboard.route")
const productRoutes = require("./product.route")
const productCategoryRoutes = require("./product-category.route")
const rolesRoutes = require("./role.route")
const accountRoutes = require("./account.route")
const systemConfig = require("../../config/system")

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin

    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes)
    app.use(PATH_ADMIN + '/products', productRoutes)
    app.use(PATH_ADMIN + '/product-category', productCategoryRoutes)
    app.use(PATH_ADMIN + '/roles', rolesRoutes)
    app.use(PATH_ADMIN + '/accounts', accountRoutes)
}