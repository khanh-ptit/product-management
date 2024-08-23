module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề bài viết")
        res.redirect("back")
        return
    }

    if (!req.body.article_category_id) {
        req.flash("error", "Vui lòng chọn danh mục cho bài viết")
        res.redirect("back")
        return
    }

    if (!req.body.description) {
        req.flash("error", "Vui lòng nhập nôi dung bài viết")
        res.redirect("back")
        return
    }

    next()
}

module.exports.editPatch = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề bài viết")
        res.redirect("back")
        return
    }

    if (!req.body.article_category_id) {
        req.flash("error", "Vui lòng chọn danh mục cho bài viết")
        res.redirect("back")
        return
    }

    if (!req.body.description) {
        req.flash("error", "Vui lòng nhập nôi dung bài viết")
        res.redirect("back")
        return
    }

    next()
}