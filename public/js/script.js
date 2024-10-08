// Show success status
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const btnCancel = showAlert.querySelector("span.btn-cancel")
    // console.log(btnCancel)
    btnCancel.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden")
    })
    const time = parseInt(showAlert.getAttribute("data-time"));

    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);
};
// End show success status

// Go back button
const btnGoBack = document.querySelectorAll("[button-go-back]")
if (btnGoBack) {
    btnGoBack.forEach(button => {
        button.addEventListener("click", () => {
            history.back()
        })
    })
}