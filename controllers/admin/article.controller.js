module.exports.index = (req, res) => {
    res.render("admin/pages/articles/index.pug", {
        pageTitle: "Danh sách bài viết"
    })
}