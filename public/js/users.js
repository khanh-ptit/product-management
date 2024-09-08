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

