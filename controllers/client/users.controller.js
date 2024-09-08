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