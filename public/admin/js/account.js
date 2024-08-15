// Delete account
const formDeleteAccount = document.querySelector("[form-delete-account]")
if (formDeleteAccount) {
    const path = formDeleteAccount.getAttribute("data-path")
    const btnDelete = document.querySelectorAll("[button-delete]")
    btnDelete.forEach(button => {
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có muốn xóa tài khoản này không?")
            if (!confirmDelete) {
                return
            } else {
                const id = button.getAttribute("data-id")
                const action = `${path}/${id}?_method=PATCH`
                console.log(action)
                formDeleteAccount.action = action
                formDeleteAccount.submit()
            }
        })
    })
}
// End delete account