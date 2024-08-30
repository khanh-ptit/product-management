// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault()
        console.log(e.target.elements.content.value)
    })
}
// End CLIENT_SEND_MESSAGE