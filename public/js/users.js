const refuseFriend = (button) => {
    button.addEventListener("click", () => {
        const userId = button.getAttribute("btn-refuse-friend")
        const parentDiv = button.closest(".box-user")
        parentDiv.classList.add("refuse")
        socket.emit("CLIENT_REFUSE_REQUEST", userId)
    })
}

const acceptFriend = (button) => {
    button.addEventListener("click", () => {
        const parentDiv = button.closest(".box-user")
        parentDiv.classList.add("accepted")

        const userId = button.getAttribute("btn-accept-friend")
        socket.emit("CLIENT_ACCEPT_REQUEST", userId)
    })
}

const addFriend = (button) => {
    button.addEventListener("click", () => {
        const userId = button.getAttribute("btn-add-friend")
        // console.log(userId)
        const div = button.closest(".box-user")
        div.classList.add("add")

        socket.emit("CLIENT_ADD_FRIEND", userId)
    })
}

const cancelFriend = (button) => {
    button.addEventListener("click", () => {
        const userId = button.getAttribute("btn-cancel-friend")
        // console.log(userId)
        const parentDiv = button.closest(".box-user")
        parentDiv.classList.remove("add")

        socket.emit("CLIENT_CANCEL_FRIEND", userId)
    })
}

// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]")
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        addFriend(button)
    })
}
// End chức năng gửi yêu cầu

// Chức năng hủy yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]")
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        cancelFriend(button)
    })
}
// End chức năng hủy yêu cầu


// Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        refuseFriend(button)
    })
}
// End chức năng từ chối kết bạn

// Chức năng đồng ý kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]")
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        acceptFriend(button)
    })
}
// End chức năng đồng ý kết bạn


// Chức năng xóa kết bạn khi đã là bạn bè
const listBtnRemoveFriend = document.querySelectorAll('[btn-remove-friend]')
if (listBtnRemoveFriend.length > 0) {
    listBtnRemoveFriend.forEach(button => {
        button.addEventListener("click", () => {
            const userId = button.getAttribute("btn-remove-friend")
            console.log(userId)
            socket.emit("CLIENT_REMOVE_FRIEND", userId)
        })
    })
}
// End chức năng xóa kết bạn khi đã là bạn bè


// "SERVER_RETURN_ACCEPT_FRIEND_LENGTH"
socket.on("SERVER_RETURN_ACCEPT_FRIEND_LENGTH", (data) => {
    // console.log(data)
    const badgeUserAccept = document.querySelector("[badge-users-accept]")
    // console.log(badgeUserAccept)
    const userId = badgeUserAccept.getAttribute("badge-users-accept")
    if (userId == data.userB_id) {
        badgeUserAccept.innerHTML = data.acceptFriendsLength
    }
})
// End "SERVER_RETURN_ACCEPT_FRIEND_LENGTH"

// "SERVER_RETURN_INFO_ACCEPT_FRIEND"
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    // Trang accept
    const dataUsersAccept = document.querySelector("[data-users-accept]")
    if (dataUsersAccept) {
        const badgeUsersAccept = document.querySelector("[badge-users-accept]")
        const userId = badgeUsersAccept.getAttribute("badge-users-accept")

        if (userId == data.userB_id) {
            const boxUserSendRequest = dataUsersAccept.querySelector(`[user-id="${data.infoUserA._id}"]`)
            if (!boxUserSendRequest) {
                // Vẽ user ra giao diện
                const div = document.createElement("div")
                div.classList.add("col-6")
                div.setAttribute("user-id", data.infoUserA._id)
                let html = `
                    <div class="box-user">
                        <div class="inner-avatar">
                            <img src="https://vnn-imgs-f.vgcloud.vn/2020/03/23/11/trend-avatar-12.jpg" alt=${data.infoUserA.fullName}>
                        </div>
                        <div class="inner-info">
                            <div class="inner-name">${data.infoUserA.fullName} </div>
                            <div class="inner-buttons"> 
                                <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.infoUserA._id}>Chấp nhận</button>
                                <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend=${data.infoUserA._id}>Xóa</button>
                                <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend="" disabled="">Đã xóa</button>
                                <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend="" disabled="">Đã chấp nhận</button>
                            </div>
                        </div>
                    </div>
                `
                div.innerHTML = html
                if (div) {
                    dataUsersAccept.appendChild(div)
                }
                // End vẽ user ra giao diện
                // Bắt sự kiện real-time
                // 1. Xóa lời mời kết bạn
                const btnRefuseFriend = div.querySelector("[btn-refuse-friend]")
                if (btnRefuseFriend) {
                    refuseFriend(btnRefuseFriend)
                }
                // 1. End xóa lời mời kết bạn

                // 2. Chấp nhận lời mời kết bạn
                const btnAcceptFriend = div.querySelector("[btn-accept-friend]")
                if (btnAcceptFriend) {
                    acceptFriend(btnAcceptFriend)
                }
                // 2. End chấp nhận lời mời kết bạn
            } else {
                console.log(boxUserSendRequest)
                const boxUserRequestChild = boxUserSendRequest.querySelector(".box-user")
                boxUserRequestChild.classList.remove("refuse")
                console.log(boxUserRequestChild)
            }


        }
    }
    // End Trang accept

    // Trang not-friend
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]")
    if (dataUsersNotFriend) {
        const badgeUsersNotFriend = document.querySelector("[badge-users-not-friend]")
        const userId = badgeUsersNotFriend.getAttribute("badge-users-not-friend")
        // Xoá A ra khỏi trang not-friend của B
        if (userId == data.userB_id) {
            const boxUserDelete = dataUsersNotFriend.querySelector(`[user-id="${data.infoUserA._id}"]`)
            dataUsersNotFriend.removeChild(boxUserDelete)
        }
    }
    // End trang not-friend
})
// End "SERVER_RETURN_INFO_ACCEPT_FRIEND"

// "SERVER_RETURN_CANCEL_FRIEND_ID"
socket.on("SERVER_RETURN_CANCEL_FRIEND_ID", (data) => {
    const badgeUsersAccept = document.querySelector("[badge-users-accept]")
    const userId = badgeUsersAccept.getAttribute("badge-users-accept")
    const dataUsersAccept = document.querySelector("[data-users-accept]")
    if (dataUsersAccept) {
        if (userId == data.userB_id) {
            const boxUserDelete = dataUsersAccept.querySelector(`[user-id="${data.userA_id}"]`)
            if (boxUserDelete) {
                dataUsersAccept.removeChild(boxUserDelete)
            }
        }
    }

    // Thêm tính năng nếu hủy kết bạn thì thêm lại A vào not-friend
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]")
    if (dataUsersNotFriend) {
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend")
        if (userId == data.userB_id) {
            const div = document.createElement("div")
            div.classList.add("col-6")
            div.setAttribute("user-id", data.userA_id)
            let html = `
                <div class="box-user">
                    <div class="inner-avatar">
                        <img src="https://vnn-imgs-f.vgcloud.vn/2020/03/23/11/trend-avatar-12.jpg" alt="Le Van A">
                    </div>
                    <div class="inner-info">
                        <div class="inner-name">${data.infoUserA.fullName} </div>
                        <div class="inner-buttons"> 
                            <button class="btn btn-sm btn-primary mr-1" btn-add-friend=${data.infoUserA._id}>Kết bạn</button>
                            <button class="btn btn-sm btn-secondary mr-1" btn-cancel-friend=${data.infoUserA._id}>Hủy</button>
                        </div>
                    </div>
                </div>
            `

            div.innerHTML = html
            dataUsersNotFriend.appendChild(div)
            const btnAddFriend = div.querySelector("[btn-add-friend]")
            if (btnAddFriend) {
                addFriend(btnAddFriend)
            }

            const btnCancelFriend = div.querySelector("[btn-cancel-friend]")
            if (btnCancelFriend) {
                cancelFriend(btnCancelFriend)
            }
        }
    }
})
// End "SERVER_RETURN_CANCEL_FRIEND_ID"

// Trường hợp là A gửi lời mời đến B. Trong trang accept, B xóa lời mời đó 
// thì ở trang not-friend phải cập nhật lại cái nút
socket.on("SERVER_RETURN_ID_A_AND_B_REFUSE_REQUEST", (data) => {
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]")
    if (dataUsersNotFriend) {
        // console.log(dataUsersNotFriend)
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend")
        if (userId == data.userA_id) {
            const boxUser = dataUsersNotFriend.querySelector(`[user-id="${data.userB_id}"]`)
            if (boxUser) {
                // console.log(boxUser)
                const childBoxUser = boxUser.querySelector(".box-user")
                if (childBoxUser) {
                    childBoxUser.classList.remove("add")
                }
            }
        }
    }
    const dataUsersRequest = document.querySelector("[data-users-request]")
    if (dataUsersRequest) {
        const userId = dataUsersRequest.getAttribute("data-users-request")
        if (userId == data.userA_id) {
            const boxUser = dataUsersRequest.querySelector(`[user-id="${data.userB_id}"]`)
            if (boxUser) {
                // console.log(boxUser)
                const childBoxUser = boxUser.querySelector(".box-user")
                if (childBoxUser) {
                    childBoxUser.classList.remove("add")
                }
            }
        }
    }
})

// Trường hợp B chập nhận yêu cầu kết bạn của A thì thêm tag (Bạn bè) B 
// ở trang danh sách người dùng của A và thêm B ở trang danh sách bạn bè
// "SERVER_RETURN_ID_A_AND_B_ACCEPT_REQUEST",
socket.on("SERVER_RETURN_ID_A_AND_B_ACCEPT_REQUEST", (data) => {
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]")
    if (dataUsersNotFriend) {
        // console.log(dataUsersNotFriend)
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend")
        if (userId == data.userA_id) {
            const boxUserChange = dataUsersNotFriend.querySelector(`[user-id="${data.userB_id}"]`)
            const boxUserChangeChild = boxUserChange.querySelector(".box-user")
            boxUserChangeChild.classList.remove("add")
            boxUserChangeChild.classList.add("is-friend")
            // console.log(boxUserChange)
        }
    }

    const dataUsersRequest = document.querySelector("[data-users-request]")
    if (dataUsersRequest) {
        // console.log(dataUsersRequest)
        const userId = dataUsersRequest.getAttribute("data-users-request")
        if (userId == data.userA_id) {
            const boxUserChange = dataUsersRequest.querySelector(`[user-id="${data.userB_id}"]`)
            const boxUserChangeChild = boxUserChange.querySelector(".box-user")
            boxUserChangeChild.classList.remove("add")
            boxUserChangeChild.classList.add("is-friend")
            // console.log(boxUserChange)
        }
    }
})
// End "SERVER_RETURN_ID_A_AND_B_ACCEPT_REQUEST",

// "SERVER_RETURN_ID_A_AND_B_REMOVE_FRIEND"
socket.on("SERVER_RETURN_ID_A_AND_B_REMOVE_FRIEND", (data) => {
    // Hiển thị nút not Bạn Bè
    const dataUsersFriend = document.querySelector("[data-users-friend]")
    if (dataUsersFriend) {
        const userId = dataUsersFriend.getAttribute("data-users-friend")
        if (userId == data.userA_id) {
            const boxUserChange = document.querySelector(`[user-id="${data.userB_id}"]`)
            const boxUserChangeChild = boxUserChange.querySelector(".box-user")
            boxUserChangeChild.classList.add("remove-friend")
        } else if (userId == data.userB_id) {
            const boxUserChange = document.querySelector(`[user-id="${data.userA_id}"]`)
            const boxUserChangeChild = boxUserChange.querySelector(".box-user")
            boxUserChangeChild.classList.add("remove-friend")
        }
    }
})

// "SERVER_RETURN_LOGIN_SUCCESSFULLY"
socket.on("SERVER_RETURN_LOGIN_SUCCESSFULLY", (data) => {
    const dataUsersFriend = document.querySelector("[data-users-friend]")
    if (dataUsersFriend) {
        const boxUserChange = dataUsersFriend.querySelector(`[user-id="${data.user_id}"]`)
        const innerStatusUser = boxUserChange.querySelector(".inner-status")
        innerStatusUser.setAttribute("status", "online")
    }
    // console.log(innerStatusUser)
})
// End "SERVER_RETURN_LOGIN_SUCCESSFULLY"

// "SERVER_RETURN_LOGOUT_SUCCESSFULLY"
socket.on("SERVER_RETURN_LOGOUT_SUCCESSFULLY", (data) => {
    const dataUsersFriend = document.querySelector("[data-users-friend]")
    if (dataUsersFriend) {
        const boxUserChange = dataUsersFriend.querySelector(`[user-id="${data.user_id}"]`)
        const innerStatusUser = boxUserChange.querySelector(".inner-status")
        innerStatusUser.setAttribute("status", "offline")
    }
})
// End "SERVER_RETURN_LOGOUT_SUCCESSFULLY"