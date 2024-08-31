const Chat = require("../../models/chat.model")

// [GET] /chat
module.exports.index = (req, res) => {
    const userId = res.locals.user.id
    // SOCKET io
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            // console.log(content, userId)
            const record = new Chat({
                user_id: userId,
                content: content
            })
            await record.save()
        })
        // console.log('a user connected', socket.id)
    })
    // End SOCKET io
    
    console.log("*")
    res.render("client/pages/chat/index.pug", {
        pageTitle: "Chat"
    })
}