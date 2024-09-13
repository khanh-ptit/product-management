const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")
const RoomChat = require("../../models/room-chat.model")
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
    
    const roomChat = await RoomChat.findOne({
        _id: roomChatId
    })

    const users = await User.find({
        deleted: false,
        status: "active"
    }).select("fullName")

    res.render("client/pages/chat/index.pug", {
        pageTitle: "Chat",
        chats: chats,
        roomChat: roomChat,
        users: users
    })
}