// Restore products
const btnsRestore = document.querySelectorAll("[button-restore]")
// console.log("ok")
// console.log(btnsRestore)
if (btnsRestore.length > 0) {
    const formRestoreItem = document.querySelector("#form-restore-item")
    const path = formRestoreItem.getAttribute("data-path")
    console.log(path)
    btnsRestore.forEach(button => {
        button.addEventListener("click", () => {
            const prouductId = button.getAttribute("data-id")
            console.log(prouductId)

            const restoreConfirm = confirm("Bạn có muốn khôi phục sản phẩm này?")
            if (restoreConfirm == true) {
                const action = `${path}/${prouductId}?_method=PATCH`
                formRestoreItem.action = action
                formRestoreItem.submit()
            } else {
                return;
            }

        })
    })
}
// End Restore products