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

// Delete products permanently
const formDeleteItemPermanent = document.querySelector('#form-delete-item-permanent')
if (formDeleteItemPermanent) {
    const path = formDeleteItemPermanent.getAttribute("data-path")
    const btnDelete = document.querySelectorAll("[button-delete-permanent]")
    if (btnDelete.length > 0) {
        btnDelete.forEach(button => {
            button.addEventListener("click", () => {
                const confirmDelete = confirm("Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm này?")
                if (!confirmDelete) {
                    return
                }
                const id = button.getAttribute("data-id")
                const action = `${path}/${id}?_method=DELETE`
                console.log(action)
                formDeleteItemPermanent.action = action
                formDeleteItemPermanent.submit()
            })
        })
    }
}