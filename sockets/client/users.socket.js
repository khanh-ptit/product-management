const User = require("../../models/user.model")

module.exports = async (res) => {
    const userA_id = res.locals.user.id
    _io.once("connection", (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userB_id) => {
            console.log(userA_id, userB_id)

            // Thêm id của B vào request của A
            const existUserBInA = await User.findOne({ // Check xem request của A có B hay chưa
                _id: userA_id,
                requestFriends: userB_id
            })
            if (!existUserBInA) {
                await User.updateOne({
                    _id: userA_id
                }, {
                    $push: {
                        requestFriends: userB_id
                    }
                })
            }

            // Thêm id của A vào accept của B
            const existUserAInB = await User.findOne({ // check trong accept của B có A hay chưa
                _id: userB_id,
                acceptFriends: userA_id
            })
            if (!existUserAInB) {
                await User.updateOne({
                    _id: userB_id
                }, {
                    $push: {
                        acceptFriends: userA_id
                    }
                })
            }

            // await User.updateOne()
        })
    })
}