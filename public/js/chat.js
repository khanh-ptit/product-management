// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault()
        const content = (e.target.elements.content.value)
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content)
            e.target.elements.content.value = ""
        }
    })
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const chatForm = document.querySelector("[my-id]")
    const myId = chatForm.getAttribute("my-id")
    console.log(myId)

    const body = document.querySelector(".chat .inner-body")
    // console.log(body)
    const div = document.createElement("div")
    let htmlFullName = ""
    if (myId == data.userId) {
        div.classList.add("inner-outgoing")
    } else {
        div.classList.add("inner-incoming")
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`

    }
    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `
    body.appendChild(div)
    body.scrollTop = body.scrollHeight
})
// End SERVER_RETURN_MESSAGE

// Function to scroll the chat to the bottom
function scrollToBottom() {
    const chatBody = document.querySelector('.inner-body');
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Scroll to bottom when the page loads
scrollToBottom();

// Example: Call scrollToBottom function whenever a new message is added
// const chatContainer = document.querySelector('.inner-body');
// const observer = new MutationObserver(scrollToBottom);
// observer.observe(chatContainer, { childList: true });