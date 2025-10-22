// 1. TÌM KIẾM SẢN PHẨM

function searchProducts() {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput.value.toLowerCase().trim();

  // Lấy tất cả sản phẩm bằng querySelectorAll
  const productItems = document.querySelectorAll(".product-item");

  // Duyệt qua từng sản phẩm
  productItems.forEach((product) => {
    const productName = product.querySelector("h3").textContent.toLowerCase();

    // Kiểm tra tên có chứa từ khóa không (không phân biệt hoa thường)
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

// 2. HIỂN THỊ/ẨN FORM THÊM SẢN PHẨM

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
