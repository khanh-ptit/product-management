module.exports.index = (req, res) => {
    // res.send("Trang sản phẩm")
    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm"
    })
}