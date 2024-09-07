import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
// import Viewer from 'viewerjs'

var timeOut

const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show")

    clearTimeout(timeOut)

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden")
    }, 3000);
}

var upload

// Fileuploadwithpreview
document.addEventListener('DOMContentLoaded', function () {
    upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
        multiple: true,
        maxFileCount: 6
    });
});
// End Fileuploadwithpreview

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault()
        const content = (e.target.elements.content.value)
        const images = upload.cachedFileArray || []
        if (content || images.length > 0) {
            // Gửi content hoặc ảnh lên server
            console.log(images)

            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            })
            upload.resetPreviewPanel()
            e.target.elements.content.value = ""
            socket.emit("CLIENT_SEND_TYPING", "hidden")
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
    let htmlContent = ""
    let htmlImages = ""
    if (data.content) {
        htmlContent = `<div class="inner-content">${data.content}</div>`
    }
    if (data.images.length > 0 && data.images) {
        htmlImages += `<div class="inner-image">`
        for (const image of data.images) {
            htmlImages += `<img src=${image}>`
        }
        htmlImages += `</div>`
    }
    if (myId == data.userId) {
        div.classList.add("inner-outgoing")
    } else {
        div.classList.add("inner-incoming")
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`

    }
    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `
    // body.appendChild(div)
    body.insertBefore(div, boxTyping)
    body.scrollTop = body.scrollHeight

    // Khởi tạo lại Viewer.js cho các ảnh mới thêm vào
    const newImages = div.querySelectorAll('.inner-image img')  // Chỉ khởi tạo cho các ảnh mới
    if (newImages.length > 0) {
        new Viewer(div.querySelector('.inner-image'), {
            inline: false,  // False để hiện pop-up
            viewed() {
                this.viewer.zoomTo(1);  // Zoom mặc định
            }
        });
    }
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

// const viewer = new Viewer(document.querySelector(".inner-image", {
//     inline: true,
//     viewed() {
//         viewer.zoomTo(1)
//     }
// }))

// const gallery = new Viewer(document.querySelector(".inner-image"))
// console.log("OK")

document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".inner-image");

    images.forEach(image => {
        new Viewer(image, {
            inline: false, // Inline false để mở pop-up preview ảnh
            viewed() {
                this.viewer.zoomTo(1); // Tự động zoom ảnh khi mở
            }
        });
    });

    console.log("Image preview initialized");
});