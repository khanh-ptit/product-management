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