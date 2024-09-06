import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

var timeOut

const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show")

    clearTimeout(timeOut)

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden")
    }, 3000);
}

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
    const boxTyping = document.querySelector(`.inner-list-typing`)
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
    // body.appendChild(div)
    body.insertBefore(div, boxTyping)
    body.scrollTop = body.scrollHeight
})
// End SERVER_RETURN_MESSAGE
const chatBody = document.querySelector('.inner-body');

// Function to scroll the chat to the bottom
function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Scroll to bottom when the page loads
scrollToBottom();

// Emoji
// Show pop-up
const buttonIcon = document.querySelector(".button-icon")
if (buttonIcon) {
    const tooltip = document.querySelector(".tooltip")

    // Chỉ khởi tạo Popper sau khi đảm bảo rằng tooltip đã có trong DOM
    document.addEventListener("DOMContentLoaded", function () {
        Popper.createPopper(buttonIcon, tooltip)
    })

    // Toggle hiển thị/ẩn tooltip khi nhấn vào buttonIcon
    buttonIcon.addEventListener("click", () => {
        tooltip.classList.toggle("shown")
    })
}

// ENd show pop-up
const emojiPicker = document.querySelector("emoji-picker")
if (emojiPicker) {
    const input = document.querySelector(".inner-form input")
    // console.log(input)
    emojiPicker.addEventListener("emoji-click", (e) => {
        const icon = e.detail.unicode
        console.log(icon)
        input.value += icon
        input.setSelectionRange(input.value.length, input.value.length)
        input.focus()
        showTyping()
    })


    input.addEventListener("keyup", () => {
        showTyping()
    })
}
// End emoji
// Typing
// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "show") {
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (!existTyping) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);

                boxTyping.innerHTML = `
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;

                elementListTyping.appendChild(boxTyping);
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        } else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove)
            }
        }
    });
}
// END SERVER_RETURN_TYPING