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

        socket.on("CLIENT_CANCEL_FRIEND", async (userB_id) => {
            console.log(userB_id)

            // Xóa id của B ra khỏi request của A
            const userA = await User.findOne({
                _id: userA_id
            })
            userA.requestFriends = userA.requestFriends.filter(item => item != userB_id)
            // console.log(userA.requestFriends)
            await userA.save()
            // console.log(newArr)
            // Xóa id của A ra khỏi accept của B
            const userB = await User.findOne({
                _id: userB_id
            })
            userB.acceptFriends = userB.acceptFriends.filter(item => item != userA_id)
            // console.log(userB.acceptFriends)
            await userB.save()
        })

        socket.on("CLIENT_REFUSE_REQUEST", async (userB_id) => {
            // Xóa id của Khánh(B) ra khỏi accept của Minh(A)
            // const userA = await User.findOne({
            //     _id: userA_id
            // })
            // const userB = await User.findOne({
            //     _id: userB_id
            // })
            // console.log(userA.acceptFriends, userB.requestFriends)
            await User.updateOne({
                _id: userA_id
            }, {
                $pull: {
                    acceptFriends: userB_id
                }
            });

            // Xóa id của Minh(A) ra khỏi request của Khánh(B)
            await User.updateOne({
                _id: userB_id
            }, {
                $pull: {
                    requestFriends: userA_id
                }
            });

        })
    })
}