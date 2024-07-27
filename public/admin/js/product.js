// Change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")

if (buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status")
    const path = formChangeStatus.getAttribute("data-path")

    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const currentStatus = button.getAttribute("data-status")
            const id = button.getAttribute("data-id")

            let changeStatus = currentStatus == "active" ? "inactive" : "active"
            console.log(currentStatus + " " + id + " " + changeStatus)

            const action = path + `/${changeStatus}/${id}?_method=PATCH`
            formChangeStatus.action = action
            console.log(action)
            formChangeStatus.submit()
        })
    })
}

// Delete products
const btnDelete = document.querySelectorAll("[button-delete]")
if (btnDelete.length > 0) {
    const formDeleteItems = document.querySelector("#form-delete-item")
    const path = formDeleteItems.getAttribute("data-path")
    btnDelete.forEach(button => {
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")
            if (confirmDelete == true) {
                const id = button.getAttribute("data-id")
                // console.log(id)
                const action = `${path}/${id}?_method=DELETE`
                console.log(action)
                formDeleteItems.action = action
                formDeleteItems.submit()
            }
        })
    })
}
// End delete products