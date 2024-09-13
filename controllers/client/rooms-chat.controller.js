const RoomChat = require("../../models/room-chat.model")
const User = require("../../models/user.model")

// [GET] /rooms-chat
module.exports.index = async (req, res) => {
    const roomsChat = await RoomChat.find({
        typeRoom: "group",
        "users.user_id": res.locals.user.id
    })
    roomsChat.forEach(roomChat => {
        // console.log(roomChat)
        const superAdmin = roomChat.users.find(item => item.role == "superAdmin")
        // console.log(superAdmin)
        roomChat.superAdmin = superAdmin
    })
    // const superAdmin = users.find(item => item.role == "superAdmin")
    // console.log(super)
    // console.log(superAdmin)
    res.render("client/pages/rooms-chat/index.pug", {
        pageTitle: "Danh sách phòng",
        roomsChat: roomsChat
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

// [GET] /rooms-chat/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const roomChatId = req.params.id
        const roomChat = await RoomChat.findOne({
            _id: roomChatId
        })
        const superAdmin = roomChat.users.find(item => item.role == "superAdmin")
        // console.log(superAdmin)
        roomChat.superAdmin = superAdmin

        // Check luôn phân quyền bên backend
        if (superAdmin.user_id != res.locals.user.id) {
            res.redirect("/404")
        }

        const friendList = res.locals.user.friendList
        const friendListIdArr = friendList.map(item => item.user_id)
        // console.log(friendListIdArr)
        const friends = await User.find({
            _id: {
                $in: friendListIdArr
            },
            status: "active",
            deleted: false
        }).select("fullName avatar")
        // console.log(roomChat)
        res.render("client/pages/rooms-chat/edit.pug", {
            pageTitle: "Chỉnh sửa phòng chat",
            roomChat: roomChat,
            friends: friends
        })
    } catch (error) {
        res.redirect("/404")
    }
}

// [PATCH] /rooms-chat/edit/:id
module.exports.editPatch = async (req, res) => {
    const roomChatId = req.params.id
    const title = req.body.title
    const usersId = req.body.usersId

    const roomChat = await RoomChat.findOne({
        _id: roomChatId,
    })
    // const tmp = roomChat.users.filter(item => usersId.includes(item.user_id))
    let newUsers = []
    usersId.forEach(userId => {
        newUsers.push({
            user_id: userId,
            role: "user"
        })
    })
    newUsers.push({
        user_id: res.locals.user.id,
        role: "superAdmin"
    })

    // Lưu vào database
    roomChat.title = title
    roomChat.users = newUsers
    await roomChat.save()

    req.flash("success", "Cập nhật thông tin phòng chat thành công!")
    res.redirect("/rooms-chat")
}