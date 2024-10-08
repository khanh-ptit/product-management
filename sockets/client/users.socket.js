const User = require("../../models/user.model")
const RoomChat = require("../../models/room-chat.model")

module.exports = async (res) => {
    const userA_id = res.locals.user.id
    _io.once("connection", (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userB_id) => {
            // console.log(userA_id, userB_id)
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

            // Lấy độ dài acceptFriends của B và trả về cho B
            const infoUserB = await User.findOne({
                _id: userB_id
            })
            const acceptFriendsLength = infoUserB.acceptFriends.length

            socket.broadcast.emit("SERVER_RETURN_ACCEPT_FRIEND_LENGTH", {
                acceptFriendsLength: acceptFriendsLength,
                userB_id: userB_id
            })

            // Lấy thông tin của A trả về cho giao diện accept cho B,
            // Khi A gửi lời mời cho B, danh sách người dùng của B phải xóa A
            const infoUserA = await User.findOne({
                _id: userA_id
            }).select("fullName avatar")
            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userB_id: userB_id,
                infoUserA: infoUserA
            })
        })

        socket.on("CLIENT_CANCEL_FRIEND", async (userB_id) => {
            // console.log(userB_id)
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

            // Khi A hủy lời mời, cập nhật số lượng bên B
            const infoUserB = await User.findOne({
                _id: userB_id
            })
            const acceptFriendsLength = infoUserB.acceptFriends.length

            socket.broadcast.emit("SERVER_RETURN_ACCEPT_FRIEND_LENGTH", {
                userB_id: userB_id,
                acceptFriendsLength: acceptFriendsLength
            })

            // Khi A hủy lời mời, gửi ID của A cho B để còn xóa data
            const infoUserA = await User.findOne({
                _id: userA_id
            })
            socket.broadcast.emit("SERVER_RETURN_CANCEL_FRIEND_ID", {
                userA_id: userA_id,
                userB_id: userB_id,
                infoUserA: infoUserA
            })
        })

        socket.on("CLIENT_REFUSE_REQUEST", async (userA_id) => {
            // Xóa id của Khánh(A) ra khỏi accept của Minh(B)
            const userB_id = res.locals.user.id
            // console.log(userB_id)
            await User.updateOne({
                _id: userB_id
            }, {
                $pull: {
                    acceptFriends: userA_id
                }
            });

            // Xóa id của Minh(B) ra khỏi request của Khánh(A)
            await User.updateOne({
                _id: userA_id
            }, {
                $pull: {
                    requestFriends: userB_id
                }
            });

            socket.broadcast.emit("SERVER_RETURN_ID_A_AND_B_REFUSE_REQUEST", {
                userA_id: userA_id,
                userB_id: userB_id
            })

        })

        // B chấp nhận yêu cầu kết bạn của A
        socket.on("CLIENT_ACCEPT_REQUEST", async (userA_id) => {
            const userB_id = res.locals.user.id

            const existBInA = await User.findOne({
                _id: userA_id,
                "friendList.user_id": userB_id
            })
            const existAInB = await User.findOne({
                _id: userB_id,
                "friendList.user_id": userA_id
            })

            // Tạo phòng chat cho A và B
            let roomChat
            if (!existAInB && !existBInA) {
                console.log("*")
                roomChat = new RoomChat({
                    typeRoom: "friend",
                    users: [{
                        user_id: userA_id,
                        role: "superAdmin"
                    }, {
                        user_id: userB_id,
                        role: "superAdmin"
                    }]
                })
            }
            await roomChat.save()
            // const newRoomChat = new 

            // Thêm object{id của B, roomchat} vào friendlist của A

            if (!existBInA) {
                await User.updateOne({
                    _id: userA_id
                }, {
                    $push: {
                        friendList: {
                            user_id: userB_id,
                            room_chat_id: roomChat._id
                        }
                    }
                })
            }
            // Xóa id của B ra khỏi request của A
            await User.updateOne({
                _id: userA_id
            }, {
                $pull: {
                    requestFriends: userB_id
                }
            })

            // Thêm object{id của A, roomchat} vào friendlist của B
            if (!existAInB) {
                await User.updateOne({
                    _id: userB_id
                }, {
                    $push: {
                        friendList: {
                            user_id: userA_id,
                            room_chat_id: roomChat._id
                        }
                    }
                })
            }
            // Xóa id của A ra khỏi accept của B
            await User.updateOne({
                _id: userB_id
            }, {
                $pull: {
                    acceptFriends: userA_id
                }
            })

            socket.broadcast.emit("SERVER_RETURN_ID_A_AND_B_ACCEPT_REQUEST", {
                userA_id: userA_id,
                userB_id: userB_id
            })
        })

        // A xóa B khi đang là bạn bè
        socket.on("CLIENT_REMOVE_FRIEND", async (userB_id) => {
            const userInfoA = await User.findOne({
                _id: userA_id,
                status: "active",
                deleted: false
            }).select("friendList")
            let friendListOfA = userInfoA.friendList
            friendListOfA = friendListOfA.filter(item => item.user_id != userB_id)
            userInfoA.friendList = friendListOfA
            // console.log(userInfoA)
            await userInfoA.save()

            const userInfoB = await User.findOne({
                _id: userB_id,
                status: "active",
                deleted: false
            }).select("friendList")
            let friendListOfB = userInfoB.friendList
            friendListOfB = friendListOfB.filter(item => item.user_id != userA_id)
            userInfoB.friendList = friendListOfB
            // console.log(userInfoB)
            await userInfoB.save()

            // Cách dùng pull
            // await User.updateOne(
            //     { _id: userA_id, status: "active", deleted: false },
            //     { $pull: { friendList: { user_id: userB_id } } }
            // );
            _io.emit("SERVER_RETURN_ID_A_AND_B_REMOVE_FRIEND", {
                userA_id: userA_id,
                userB_id: userB_id
            })
        })
    })
}