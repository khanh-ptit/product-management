const RoomChat = require("../../models/room-chat.model")
const User = require("../../models/user.model")

// [GET] /rooms-chat
module.exports.index = (req, res) => {
    res.render("client/pages/rooms-chat/index.pug", {
        pageTitle: "Danh sách phòng"
    })
}

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
    const myUserId = res.locals.user.id
    const myUser = await User.findOne({
        _id: myUserId
    }).select("friendList")
    // const friendListArr = myUser.friendList
    const friendListIdArr = myUser.friendList.map(item => item.user_id)
    const users = await User.find({
        _id: {
            $in: friendListIdArr
        },
        status: "active",
        deleted: false
    }).select("avatar fullName")
    
    res.render("client/pages/rooms-chat/create.pug", {
        pageTitle: "Tạo phòng chat",
        users: users
    })
}

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
    const title = req.body.title
    const usersId = req.body.usersId
    
    const roomChat = {
        title: title,
        typeRoom: "group",
        users: []
    }

    usersId.forEach(userId => {
        roomChat.users.push({
            user_id: userId,
            role: "user"
        })
    })

    roomChat.users.push({
        user_id: res.locals.user.id,
        role: "superAdmin"
    })

    const room = new RoomChat(roomChat)
    await room.save()

    res.redirect(`/chat/${room.id}`)
}