const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")

const userSockets = {}; // { userId: [socketIDs] }

// [GET] /chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName
    // SOCKET io
    _io.once('connection', (socket) => {
        userSockets[userId] = socket.id;
        console.log("Socket connected:", socket.id);
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            // console.log(content, userId)
            const record = new Chat({
                user_id: userId,
                content: content
            })
            await record.save()

            // Trả data về client
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: content
            })
        })
        
        socket.on("CLIENT_SEND_TYPING", (type) => {
            console.log("User", fullName, "is typing", type);
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            })
        })
    })
    // End SOCKET io

    // Lấy data in ra giao diện
    const chats = await Chat.find({deleted: false})
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