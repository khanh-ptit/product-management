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