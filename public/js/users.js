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
        refuseFriend(button)
    })
}
// End chức năng từ chối kết bạn

const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]")
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        acceptFriend(button)
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

// "SERVER_RETURN_INFO_ACCEPT_FRIEND"
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector("[data-users-accept]")
    console.log(dataUsersAccept)
    const badgeUsersAccept = document.querySelector("[badge-users-accept]")
    const userId = badgeUsersAccept.getAttribute("badge-users-accept")
    if (userId == data.userB_id) {
        // Vẽ user ra giao diện
        const div = document.createElement("div")
        div.classList.add("col-6")

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
        dataUsersAccept.appendChild(div)
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
    }
})
// End "SERVER_RETURN_INFO_ACCEPT_FRIEND"