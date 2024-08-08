// Permission
const tablePermissions = document.querySelector("[table-permissions]")
if (tablePermissions) {
    const btnSubmit = document.querySelector("[button-submit]")
    btnSubmit.addEventListener("click", () => {
        let permissions = []
        const rows = tablePermissions.querySelectorAll("[data-name]")

        rows.forEach((row) => {
            const dataName = row.getAttribute("data-name")
            const checkBoxes = row.querySelectorAll("input")
            if (dataName == "id") {
                checkBoxes.forEach(checkBox => {
                    permissions.push({
                        id: checkBox.value,
                        permissions: []
                    })
                })
            } else {
                checkBoxes.forEach((checkBox, index) => {
                    if (checkBox.checked) {
                        // console.log(checkBox)
                        permissions[index].permissions.push(dataName)
                    }
                })
            }
        })
        if (permissions.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions")
            if (formChangePermissions) {
                const inputSend = formChangePermissions.querySelector("input[name='permissions']")
                inputSend.value = JSON.stringify(permissions)
                formChangePermissions.submit()
            }
        }
    })
}
// End permission

// Permission data default
// const dataRecords = document.querySelector("[data-records]")
// if (dataRecords) {
//     const tablePermissions = document.querySelector("[table-permissions]")
//     const records = JSON.parse(dataRecords.getAttribute("data-records"))
//     console.log(records)
//     records.forEach((record, index) => {
//         const permissions = record.permissions

//         permissions.forEach(permission => {
//             const row = tablePermissions.querySelector(`[data-name='${permission}']`);
//             // console.log(row)
//             const input = row.querySelectorAll("input")[index]
//             // console.log(input)
//             input.checked = true
//         })
//     })
// }
const dataRecords = document.querySelector("[data-records]")
if (dataRecords) {
    const tablePermissions = document.querySelector("[table-permissions]")
    if (tablePermissions) {
        // console.log(dataRecords)
        const records = JSON.parse(dataRecords.getAttribute("data-records"))
        // console.log(records)

        records.forEach((record, index) => {
            const permissions = record.permissions
            permissions.forEach(permission => {
                const row = tablePermissions.querySelector(`[data-name='${permission}']`);
                console.log(row)
                const input = row.querySelectorAll("input")[index]
                input.checked = true
            })
            // console.log(permissions)
        })
    }
}
// End permission data default