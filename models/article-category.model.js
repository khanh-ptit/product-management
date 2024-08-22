const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const articalCategorySchema = new mongoose.Schema({
    title: String,
    parent_id: {
        type: String,
        default: ""
    },
    description: String,
    status: String,
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: new Date()
        }
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    updatedBy: [{
        account_id: String,
        updatedAt: Date
    }],
    deleted: {
        type: Boolean,
        default: false
    }
})

const ArticalCategory = mongoose.model('ArticalCategory', articalCategorySchema, "artical-category")

module.exports = ArticalCategory