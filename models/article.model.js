const mongoose = require('mongoose')
const slug = require("mongoose-slug-updater")
mongoose.plugin(slug)

const articleSchema = new mongoose.Schema({
    title: String,
    article_category_id: String,
    description: String,
    status: {
        type: String,
        default: "active"
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: new Date()
        }
    },
    updatedBy: [{
        account_id: String,
        updatedAt: Date
    }],
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
})

const Article = mongoose.model('Article', articleSchema, 'articles')

module.exports = Article