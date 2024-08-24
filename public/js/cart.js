// Confirm delete item from cart
const buttonDeleteProductItem = document.querySelectorAll("[button-delete-product-item]")
if (buttonDeleteProductItem.length > 0) {
    buttonDeleteProductItem.forEach(button => {
        button.addEventListener("click", (event) => {
            const isConfirmed = confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?");
            if (!isConfirmed) {
                event.preventDefault(); // Ngăn chặn hành động mặc định nếu người dùng chọn 'Cancel'
            }
        })
    })
}
// End confirm delete item from cart

// Update product's quantity in cart
const inputQuantity = document.querySelectorAll('input[name="quantity"]')
if (inputQuantity.length > 0) {
    inputQuantity.forEach(input => {
        input.addEventListener("change", (e) => {
            // e.target thực chất là thẻ input
            const productId = e.target.getAttribute("product-id")
            const quantity = e.target.value
            // console.log(productId, quantity)
            // console.log(e.target.value)
            // Chuyển hướng URL sang route update product quantity
            if (quantity >= 1) {
                window.location.href = `cart/update/${productId}/${quantity}`
            }
        })
    })
}
// End update product's quantity in cart
