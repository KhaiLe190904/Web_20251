// ========== 1. TÌM KIẾM SẢN PHẨM ==========

function searchProducts() {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput.value.toLowerCase().trim();

  // Lấy lại danh sách mỗi lần để bao gồm sản phẩm mới thêm
  const productItems = document.querySelectorAll(".product-item");

  productItems.forEach((product) => {
    const productName = product.querySelector("h3").textContent.toLowerCase();

    if (productName.includes(searchTerm)) {
      product.style.display = "";
    } else {
      product.style.display = "none";
    }
  });
}

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", searchProducts);

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    searchProducts();
  }
});

// ========== 2. HIỂN THỊ/ẨN FORM THÊM SẢN PHẨM ==========

function toggleAddProductForm() {
  const addProductForm = document.getElementById("addProductForm");
  addProductForm.classList.toggle("hidden");

  if (!addProductForm.classList.contains("hidden")) {
    addProductForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

const addProductBtn = document.getElementById("addProductBtn");
addProductBtn.addEventListener("click", toggleAddProductForm);

const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click", () => {
  document.getElementById("addProductForm").classList.add("hidden");
  document.getElementById("productForm").reset();
});

// ========== 3. VALIDATION VÀ THÊM SẢN PHẨM ==========

function validateProductData(name, price) {
  // Kiểm tra tên sản phẩm không được rỗng
  if (name === "") {
    return "Vui lòng nhập tên sản phẩm!";
  }

  // Kiểm tra giá không được rỗng
  if (price === "") {
    return "Vui lòng nhập giá sản phẩm!";
  }

  // Chuyển price sang Number để kiểm tra
  const priceNumber = Number(price);

  // Kiểm tra giá phải là số hợp lệ (dùng isNaN)
  if (isNaN(priceNumber)) {
    return "Giá sản phẩm phải là số hợp lệ!";
  }

  // Kiểm tra giá phải lớn hơn 0
  if (priceNumber <= 0) {
    return "Giá sản phẩm phải lớn hơn 0!";
  }

  return "";
}

function handleAddProduct(event) {
  // Ngăn form submit mặc định
  event.preventDefault();

  // Lấy giá trị từ các trường input
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const description = document.getElementById("productDescription").value.trim();
  const imageUrl = document.getElementById("productImage").value.trim();

  // Validate dữ liệu
  const errorMessage = validateProductData(name, price);

  if (errorMessage !== "") {
    alert(errorMessage);
    return;
  }

  // Tạo phần tử sản phẩm mới bằng createElement
  const newProduct = document.createElement("article");
  newProduct.className = "product-item";

  // Sử dụng innerHTML để tạo nội dung HTML
  newProduct.innerHTML = `
    ${
      imageUrl
        ? `<img src="${imageUrl}" alt="${name}">`
        : '<img src="https://via.placeholder.com/300x200?text=New+Product" alt="New Product">'
    }
    <h3>${name}</h3>
    <p class="product-description">${description || "Sản phẩm mới"}</p>
    <p class="product-price">
      <strong>Giá:</strong> ${Number(price).toLocaleString("vi-VN")}đ
    </p>
  `;

  // Chèn sản phẩm mới vào đầu danh sách
  const productList = document.querySelector(".product-list");
  productList.prepend(newProduct);

  // Reset form
  document.getElementById("productForm").reset();

  // Ẩn form
  document.getElementById("addProductForm").classList.add("hidden");

  // Thông báo thành công
  alert(`Đã thêm sản phẩm "${name}" thành công!`);
}

// Gắn sự kiện submit cho form
const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", handleAddProduct);
