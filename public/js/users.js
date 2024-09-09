// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]")
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            const userId = button.getAttribute("btn-add-friend")
            console.log(userId)
            const div = button.closest(".box-user")
            div.classList.add("add")

            socket.emit("CLIENT_ADD_FRIEND", userId)
        })
    })
}
// End chức năng gửi yêu cầu

// Chức năng hủy yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]")
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            const userId = button.getAttribute("btn-cancel-friend")
            console.log(userId)
            const parentDiv = button.closest(".box-user")
            parentDiv.classList.remove("add")

            socket.emit("CLIENT_CANCEL_FRIEND", userId)
        })
    })
}
// End chức năng hủy yêu cầu


// Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", () => {
            const userId = button.getAttribute("btn-refuse-friend")
            const parentDiv = button.closest(".box-user")
            parentDiv.classList.add("refuse")
            socket.emit("CLIENT_REFUSE_REQUEST", userId)
        })
    })
}
// End chức năng từ chối kết bạn

const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]")
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        button.addEventListener("click", () => {
            const parentDiv = button.closest(".box-user")
            parentDiv.classList.add("accepted")

            const userId = button.getAttribute("btn-accept-friend")
            socket.emit("CLIENT_ACCEPT_REQUEST", userId)
        })
    })
}

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