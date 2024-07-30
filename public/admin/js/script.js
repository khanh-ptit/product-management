// Button status
const buttonsStatus = document.querySelectorAll("[button-status]")
if (buttonsStatus.length > 0) {
    let url = new URL(window.location.href)
    // console.log(url)

    buttonsStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status")
            console.log(status)

            if (status) {
                url.searchParams.set("status", status)
            } else {
                url.searchParams.delete("status")
            }
            // console.log(url.href)
            window.location.href = url.href // Chuyển hướng sang trang khác
        })
    })
}

// Form Search
const formSearch = document.querySelector("#form-search")
let url = new URL(window.location.href)
if (formSearch) {
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault()
        const keyword = e.target.elements.keyword.value
        console.log(keyword)
        if (keyword) {
            url.searchParams.set("keyword", keyword)
        } else {
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href
    })
}

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]")
// console.log(buttonsPagination)
if (buttonsPagination.length > 0) {
    let url = new URL(window.location.href)
    console.log(url.href)
    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination")
            console.log(page)
            if (page) {
                url.searchParams.set("page", page)
            } else {
                url.searchParams.delete("page")
            }
            window.location.href = url.href
        })
    })

}
// End pagination

// Checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    // console.log(inputCheckAll.checked)
    const inputsSingle = document.querySelectorAll("input[name='id']")

    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked == true) {
            inputsSingle.forEach(input => {
                input.checked = true
            })
        } else {
            inputsSingle.forEach(input => {
                input.checked = false
            })
        }
    })

    inputsSingle.forEach(input => {
        input.addEventListener("click", () => {
            const countSingle = document.querySelectorAll("input[name='id']:checked").length // checked: css selector
            const countAll = document.querySelectorAll("input[name='id']").length
            // console.log(countAll)
            // console.log(countSingle)
            if (countSingle == countAll) {
                inputCheckAll.checked = true
            } else {
                inputCheckAll.checked = false
            }
        })
    })
}
// End checkbox multi

// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault()
        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")
        // console.log(inputsChecked)
        // console.log(textField)

        const typeChange = e.target.elements.type.value;
        console.log(typeChange)

        if (typeChange == "delete-all") {
            const confirmDelete = confirm("Bạn có muốn xóa tất cả các sản phẩm này?")
            if (!confirmDelete) {
                return
            }
        }  

        if (inputsChecked.length > 0) {
            let ids = []
            const inputIds = formChangeMulti.querySelector("input[class='form-control']")
            let stringIDs = ''
            inputsChecked.forEach(input => {
                const id = input.getAttribute("value")
                ids.push(id)
            })
            stringIDs = ids.join(", ")
            console.log(stringIDs)
            console.log(inputIds)
            inputIds.value = stringIDs
        } else {
            alert("Vui lòng chọn ít nhất một bản ghi")
            return
        }
        formChangeMulti.submit()
    })
}