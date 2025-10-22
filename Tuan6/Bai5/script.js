// ========== 1. KHỞI TẠO VÀ LOCALSTORAGE ==========

const STORAGE_KEY = "products";

// Khởi tạo sản phẩm mẫu
const initialProducts = [
  {
    name: "Elden Ring - PS5",
    price: 1490000,
    desc: "Game nhập vai thế giới mở đình đám, kết hợp giữa FromSoftware và George R.R. Martin. Khám phá thế giới rộng lớn với gameplay đầy thử thách và câu chuyện hấp dẫn.",
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/256839312/3bcf246a6f06cc165a6afb8b15db4626efe10fcf/movie_232x130.jpg?t=1739917125",
  },
  {
    name: "The Legend of Zelda: Tears of the Kingdom - Switch",
    price: 1590000,
    desc: "Phần tiếp theo của Breath of the Wild, mang đến trải nghiệm phiêu lưu mới với cơ chế gameplay sáng tạo và thế giới Hyrule rộng lớn hơn bao giờ hết.",
    image:
      "https://haloshop.vn/wp-content/uploads/2025/02/the-legend-of-zelda-tears-of-the-kingdom-switch-700x700h.jpg",
  },
  {
    name: "Starfield - Xbox Series X",
    price: 1390000,
    desc: "Game nhập vai không gian đầu tay của Bethesda. Khám phá vũ trụ rộng lớn với hàng nghìn hành tinh, tự do xây dựng tàu vũ trụ và viết nên câu chuyện của riêng bạn.",
    image:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1716740/capsule_616x353.jpg?t=1749757928",
  },
];

// Tạo phần tử HTML từ dữ liệu sản phẩm
function createProductElement(product) {
  const productElement = document.createElement("article");
  productElement.className = "product-item";
  productElement.innerHTML = `
    ${
      product.image
        ? `<img src="${product.image}" alt="${product.name}">`
        : '<img src="https://via.placeholder.com/300x200?text=No+Image" alt="No Image">'
    }
    <h3>${product.name}</h3>
    <p class="product-description">${product.desc || "Sản phẩm mới"}</p>
    <p class="product-price">
      <strong>Giá:</strong> ${Number(product.price).toLocaleString("vi-VN")}đ
    </p>
  `;

  return productElement;
}

// Load sản phẩm từ localStorage
function loadProductsFromLocalStorage() {
  const productList = document.querySelector(".product-list");
  productList.innerHTML = "";

  // Kiểm tra localStorage có dữ liệu không
  const storedData = localStorage.getItem(STORAGE_KEY);

  let products;
  if (storedData) {
    // Parse JSON từ localStorage
    products = JSON.parse(storedData);
  } else {
    // Nếu chưa có, khởi tạo với sản phẩm mẫu
    products = initialProducts;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }

  // Hiển thị tất cả sản phẩm
  products.forEach((product) => {
    const productElement = createProductElement(product);
    productList.appendChild(productElement);
  });
}

// Lưu sản phẩm vào localStorage
function saveProductsToLocalStorage(newProduct) {
  // Lấy danh sách hiện tại từ localStorage
  const storedData = localStorage.getItem(STORAGE_KEY);
  const products = storedData ? JSON.parse(storedData) : [];

  // Thêm sản phẩm mới vào đầu mảng
  products.unshift(newProduct);

  // Lưu lại vào localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// ========== 2. TÌM KIẾM SẢN PHẨM ==========

function searchProducts() {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput.value.toLowerCase().trim();

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

// ========== 3. HIỂN THỊ/ẨN FORM THÊM SẢN PHẨM ==========

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

// ========== 4. VALIDATION VÀ THÊM SẢN PHẨM ==========

function validateProductData(name, price) {
  if (name === "") {
    return "Vui lòng nhập tên sản phẩm!";
  }

  if (price === "") {
    return "Vui lòng nhập giá sản phẩm!";
  }

  const priceNumber = Number(price);

  if (isNaN(priceNumber)) {
    return "Giá sản phẩm phải là số hợp lệ!";
  }

  if (priceNumber <= 0) {
    return "Giá sản phẩm phải lớn hơn 0!";
  }

  return "";
}

function handleAddProduct(event) {
  event.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const description = document
    .getElementById("productDescription")
    .value.trim();
  const imageUrl = document.getElementById("productImage").value.trim();

  const errorMessage = validateProductData(name, price);

  if (errorMessage !== "") {
    alert(errorMessage);
    return;
  }

  // Tạo đối tượng sản phẩm mới
  const newProduct = {
    name: name,
    price: Number(price),
    desc: description,
    image: imageUrl,
  };

  // Lưu vào localStorage
  saveProductsToLocalStorage(newProduct);

  // Tạo phần tử HTML
  const productElement = createProductElement(newProduct);

  // Chèn vào đầu danh sách
  const productList = document.querySelector(".product-list");
  productList.prepend(productElement);

  // Reset form và ẩn
  document.getElementById("productForm").reset();
  document.getElementById("addProductForm").classList.add("hidden");

  alert(`Đã thêm sản phẩm "${name}" thành công!`);
}

// Gắn sự kiện submit cho form
const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", handleAddProduct);

// ========== 5. LOAD SẢN PHẨM KHI TRANG LOAD ==========

document.addEventListener("DOMContentLoaded", loadProductsFromLocalStorage);
