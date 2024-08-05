const formDeleteProductCategory = document.querySelector("#form-delete-product-category")
if (formDeleteProductCategory) {
    const path = formDeleteProductCategory.getAttribute("data-path")
    console.log(path)
    const btnDelete = document.querySelectorAll("[button-delete ]")
    btnDelete.forEach(button => {
        button.addEventListener("click", () => {
            const deleteConfirm = confirm("Bạn có chắc chắn muốn xóa danh mục sản phẩm này?")
            if (!deleteConfirm) {
                return
            } else {
                const id = button.getAttribute("data-id")
                const action = `${path}/${id}?_method=PATCH`
                console.log(action)
                formDeleteProductCategory.action = action
                formDeleteProductCategory.submit()
            }
        })
    })
}