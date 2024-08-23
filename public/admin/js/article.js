// Delete item
const formDeleteItem = document.querySelector('[form-delete-item]')
if (formDeleteItem) {
    const path = formDeleteItem.getAttribute('data-path')
    const btnsDelete = document.querySelectorAll('[button-delete-item]')
    btnsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có chắc chắn muốn xóa bài viết này?")
            if (!confirmDelete) {
                return
            }
            const id = button.getAttribute("data-id")
            const action = `${path}/${id}?_method=PATCH`
            formDeleteItem.action = action
            formDeleteItem.submit()
        })
    })
}
// End delete item

// Change status
const formChangeStatus = document.querySelector("[form-change-status]")
if (formChangeStatus) {
    const path = formChangeStatus.getAttribute("data-path")
    const btnsChangeStatus = document.querySelectorAll("[button-change-status]")
    btnsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            let status = button.getAttribute("status")
            if (status == "active") {
                status = "inactive"
            } else {
                status = "active"
            }
            const id = button.getAttribute("data-id")
            const action = `${path}/${id}/${status}?_method=PATCH`
            formChangeStatus.action = action
            formChangeStatus.submit()
        })
    })
}
// End change status