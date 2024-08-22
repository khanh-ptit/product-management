// Delete item
const formDeleteItem = document.querySelector("[form-delete-item]")
if (formDeleteItem) {
    const path = formDeleteItem.getAttribute("data-path")
    console.log(path)
    const btnDelete = document.querySelectorAll("[button-delete]")
    if (btnDelete) {
        btnDelete.forEach(button => {
            button.addEventListener("click", () => {
                const confirmDelete = confirm("Bạn có chắc chắn muốn xóa danh mục bài viết này?")
                if (!confirmDelete) {
                    return
                }
                const id = button.getAttribute("data-id")
                const action = `${path}/${id}?_method=PATCH`
                console.log(action)
                formDeleteItem.action = action
                formDeleteItem.submit()
            })
        })
    }
}
// End delete item

// Change status
const formChangeStatus = document.querySelector("[form-change-status]")
if (formChangeStatus) {
    const path = formChangeStatus.getAttribute("data-path")
    const btnChangeStatus = document.querySelectorAll("[button-change-status]")
    btnChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            let status = button.getAttribute("data-status")
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
