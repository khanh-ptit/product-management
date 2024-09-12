const User = require("../../models/user.model")
const usersSocket = require("../../sockets/client/users.socket")

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
    const userId = res.locals.user.id
    usersSocket(res)
    const myUser = await User.findOne({
        _id: userId
    })
    const requestFriendsArr = myUser.requestFriends
    const acceptFriendsArr = myUser.acceptFriends
    const friendList = myUser.friendList
    const friendListArr = []
    friendList.forEach(friend => {
        friendListArr.push(friend.user_id)
    })
    // console.log(friendListArr)
    const users = await User.find({
        $and: [{
                _id: {
                    $ne: userId
                }
            },
            {
                _id: {
                    $nin: requestFriendsArr
                }
            },
            {
                _id: {
                    $nin: acceptFriendsArr
                }
            },
            {
                _id: {
                    $nin: friendListArr
                }
            }
        ],
        status: "active",
        deleted: false
    }).select("fullName avatar")

    res.render("client/pages/users/not-friend.pug", {
        pageTitle: "Danh sách người dùng",
        users: users
    })
}

// [GET] /users/request
module.exports.request = async (req, res) => {
    usersSocket(res)

    const myUserId = res.locals.user.id
    const myUser = await User.findOne({
        _id: myUserId
    })
    const requestFriendsArr = myUser.requestFriends
    // console.log(requestFriendsArr)
    const users = await User.find({
        $and: [{
            _id: {
                $ne: myUserId
            },
        }, {
            _id: {
                $in: requestFriendsArr
            }
        }],
        status: "active",
        deleted: false
    }).select("fullName avatar")
    res.render("client/pages/users/request.pug", {
        pageTitle: "Lời mời đã gửi",
        users: users
    })
}

// [GET] /users/accept
module.exports.accept = async (req, res) => {
    usersSocket(res)
    const myUserId = res.locals.user.id
    const myUser = await User.findOne({
        _id: myUserId
    })
    const acceptFriendsArr = myUser.acceptFriends
    // console.log(acceptFriendsArr)
    const users = await User.find({
        _id: {
            $in: acceptFriendsArr
        },
        status: "active",
        deleted: false
    })
    res.render("client/pages/users/accept.pug", {
        pageTitle: "Lời mời kết bạn",
        users: users
    })
}

// [GET] /users/friend
module.exports.friend = async (req, res) => {
    usersSocket(res)
    const myUserId = res.locals.user.id
    const myUser = await User.findOne({
        _id: myUserId
    })
    const friendListIdArr = myUser.friendList.map(item => item.user_id)

    // console.log(friendListIdArr)

    const users = await User.find({
        _id: {
            $in: friendListIdArr
        }, 
        status: "active",
        deleted: false
    }).select("id avatar fullName statusOnline friendList")
    // console.log(users)

    // Lặp qua các user trong friendList, 
    // với điều kiện là id của user trong friendList 
    // phải bằng đó phải bằng id của user
    users.forEach(user => {
        const infoUser = myUser.friendList.find(item => item.user_id == user.id)
        // console.log(infoUser)
        user.roomChatId = infoUser.room_chat_id
    })

    res.render("client/pages/users/friend.pug", {
        pageTitle: "Danh sách bạn bè",
        users: users
    })
}