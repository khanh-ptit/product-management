const Chat = require("../../models/chat.model")
const uploadToCloudinary = require("../../helpers/uploadToCloudinary")

module.exports = async (res) => {
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName
    // SOCKET io
    _io.once('connection', (socket) => {
        console.log("Socket connected:", socket.id);
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            // console.log(content, userId)
            // Luư vào database
            let images = []
            for (const imageBuffer of data.images) {
                const link = await uploadToCloudinary(imageBuffer)
                images.push(link)
            }
            const record = new Chat({
                user_id: userId,
                content: data.content,
                images: images
            })
            await record.save()

            // Trả data về client
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images
            })
        })

        socket.on("CLIENT_SEND_TYPING", (type) => {
            // console.log("User", fullName, "is typing", type);
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            })
        })
    })
    // End SOCKET io
}