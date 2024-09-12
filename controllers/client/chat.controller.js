const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")
const chatSocket = require("../../sockets/client/chat.socket")

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
    const roomChatId = req.params.roomChatId
    // console.log(roomChatId)
    // SocketIO
    chatSocket(req, res)
    // End socketIO

    // Lấy data in ra giao diện
    const chats = await Chat.find({
        room_chat_id: roomChatId,
        deleted: false
    })
    // console.log(chats)
    for (const chat of chats) {
        const userId = chat.user_id
        const user = await User.findOne({
            _id: userId
        }).select("fullName")
        chat.infoUser = user
    }
    // console.log(chats.infoUser)
    res.render("client/pages/chat/index.pug", {
        pageTitle: "Chat",
        chats: chats
    })
}