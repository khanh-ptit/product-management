const Product = require('../../models/product.model')
const ProductCategory = require('../../models/product-category.model')
const Account = require('../../models/account.model')

const systemConfig = require("../../config/system")
const filterStatusHelper = require('../../helpers/filterStatus')
const searchHelper = require('../../helpers/search')
const paginationHelper = require('../../helpers/pagination')
const createTreeHelper = require('../../helpers/createTree')
const Role = require('../../models/role.model')


// [GET] /admin/products
module.exports.index = async (req, res) => {
    // console.log(req.query.status)
    // Bộ lọc
    const filterStatus = filterStatusHelper(req.query)

    let find = {
        deleted: false,
    }

    if (req.query.status) {
        find.status = req.query.status
    }
    const objectSearch = searchHelper(req.query)

    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    const countProducts = await Product.countDocuments(find)
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    }, req.query, countProducts)


    // sort products
    let sort = {}

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.position = "desc"
    }
    // end sort products

    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)

    const accounts = await Account.find({
        deleted: false
    })
    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
        accounts: accounts
    })
}

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    console.log(req.params) // { status: 'active', id: '1' }
    const status = req.params.status
    const id = req.params.id

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Product.updateOne({
        _id: id
    }, {
        status: status,
        $push: {
            updatedBy: updatedBy // Thêm log mới vào mảng updatedBy
        }
    })

    req.flash("success", "Cập nhật trạng thái thành công")

    res.redirect("back")
}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    // console.log(req)
    // console.log(req.body) // { status: 'active', id: '1' }
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active",
                $push: {
                    updatedBy: updatedBy
                }
            })
            req.flash("success", `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công`)

            break
        case "inactive":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive",
                $push: {
                    updatedBy: updatedBy
                }
            })
            req.flash("success", `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công`)
            break
        case "delete-all":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: true,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: Date(Date.now())
                }
            })
            req.flash("success", `Xóa ${ids.length} sản phẩm thành công`)
            break
        case "change-position":
            // console.log(ids)
            for (const item of ids) {
                // console.log(item)
                let [id, position] = item.split("-"); // Corrected variable name here
                position = parseInt(position);
                await Product.updateOne({
                    _id: id
                }, {
                    position: position,
                    $push: {
                        updatedBy: updatedBy
                    }
                })
            }
            req.flash("success", `Cập nhật vị trí cho ${ids.length} sản phẩm thành công`)
            break;
        case "restore-all":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: false,
            })
            req.flash("success", `Khôi phục ${ids.length} sản phẩm thành công`)
            break
        default:
            break
    }
    res.redirect("back")
}

//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id
    // await Product.deleteOne({_id: id}) Xóa cứng
    await Product.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    })
    req.flash("success", `Xóa sản phẩm thành công`)
    res.redirect("back")
}

//[GET] /admin/products/delete-products
module.exports.deleteProducts = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query)
    let find = {
        deleted: true,
    }
    if (req.query.status) {
        find.status = req.query.status
    }
    const objectSearch = searchHelper(req.query)
    // console.log(objectSearch)

    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    // Pagination
    // const objectPagination = paginationHelper(req.query, Product, find)
    const countProducts = await Product.countDocuments(find)
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    }, req.query, countProducts)
    // const deletedProducts = await Product.find({deleted: true})
    const deletedProducts = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)
    const accounts = await Account.find({
        deleted: false
    })

    res.render("admin/pages/products/deleted-products.pug", {
        products: deletedProducts,
        pageTitle: "Trang sản phẩm đã xóa",
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
        accounts: accounts
    })
}

// [PATCH] /admin/products/restore/:id
module.exports.restoreItem = async (req, res) => {
    // const id = req.params.id
    console.log(req.params)
    await Product.updateOne({
        _id: req.params.id
    }, {
        deleted: false
    })
    req.flash("success", `Khôi phục sản phẩm thành công`)
    res.redirect("back")
}

// [DELETE] /admin/products/delete-permanent/:id
module.exports.deletePermanent = async (req, res) => {
    try {
        const id = req.params.id;
        await Product.deleteOne({
            _id: id
        });
        req.flash("success", "Đã xóa thành công sản phẩm khỏi thùng rác!");
    } catch (err) {
        req.flash("error", "Có lỗi xảy ra khi xóa sản phẩm!");
    }

    res.redirect(`${systemConfig.prefixAdmin}/products/deleted-products`);
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const category = await ProductCategory.find(find)
    // console.log(category)
    const treeCategory = createTreeHelper.tree(category)

    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        category: treeCategory
    })
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    if (req.body.position == '') {
        const countProducts = await Product.countDocuments()
        // console.log(countProducts)
        req.body.position = countProducts + 1
    } else {
        req.body.position = parseInt(req.body.position)
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    }
    // if (req.file) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`
    // }
    // console.log(req.body)
    const product = new Product(req.body)
    await product.save()
    req.flash("success", "Thêm thành công sản phẩm")
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        const find = {
            deleted: false,
            _id: id
        }
        const product = await Product.findOne(find)
        const category = await ProductCategory.find({
            deleted: false
        })
        const treeCategory = createTreeHelper.tree(category)
        // console.log(product)
        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            category: treeCategory
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    // console.log(req.body)
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)

    // if (req.file) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`
    // }

    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        // req.body.updatedBy = updatedBy

        await Product.updateOne({
            _id: req.params.id
        }, {
            $set: req.body, // Cập nhật các trường trong body
            $push: {
                updatedBy: updatedBy // Thêm log mới vào mảng updatedBy
            }
        })
        req.flash("success", "Cập nhật thành công sản phẩm")
    } catch (error) {
        // console.log("error")
        req.flash("error", "Cập nhật thất bại")
    }
    // res.redirect(`${systemConfig.prefixAdmin}/products`)
    res.redirect("back")
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const find = {
            deleted: false,
            _id: id
        }
        const product = await Product.findOne(find)
        // console.log(product)
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}