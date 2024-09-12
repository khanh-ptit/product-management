const RoomChat = require("../../models/room-chat.model")

module.exports.isAccess = async (req, res, next) => {
    try {
        const roomChatId = req.params.roomChatId
        const userId = res.locals.user.id

        const exist = await RoomChat.findOne({
            _id: roomChatId,
            "users.user_id": userId,
            deleted: false
        })

        if (!exist) {
            res.redirect("/404")
        } else {
            next()
        }
    } catch (error) {
        res.redirect("/404")
    }

}