const mongoose = require("mongoose")
const generate = require("../helpers/generate")

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
        type: String,
        default: () => generate.generateRandomString(30) // Sử dụng callback
    },
    phone: String,
    avatar: String,
    statusOnline: String,
    friendList: [{
        user_id: String,
        room_chat_id: String
    }],
    acceptFriends: Array,
    requestFriends: Array,
    status: {
        type: String,
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema, "users")

module.exports = User