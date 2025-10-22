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
function createProductElement(product, index) {
  const productElement = document.createElement("article");
  productElement.className = "product-item";
  productElement.setAttribute("data-price", product.price);
  productElement.setAttribute("data-name", product.name);
  productElement.setAttribute("data-index", index);

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
    <button class="delete-btn" data-index="${index}">🗑️ Xóa</button>
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
  products.forEach((product, index) => {
    const productElement = createProductElement(product, index);
    productList.appendChild(productElement);
  });

  // Gắn sự kiện xóa cho tất cả nút xóa
  attachDeleteEvents();
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

// ========== 2. XÓA SẢN PHẨM ==========

function attachDeleteEvents() {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      deleteProduct(index);
    });
  });
}

function deleteProduct(index) {
  const storedData = localStorage.getItem(STORAGE_KEY);
  const products = storedData ? JSON.parse(storedData) : [];

  if (confirm(`Bạn có chắc muốn xóa sản phẩm "${products[index].name}"?`)) {
    products.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    loadProductsFromLocalStorage();
  }
}

// ========== 3. TÌM KIẾM VÀ LỌC NÂNG CAO ==========

function filterAndSortProducts() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const priceFilter = document.getElementById("priceFilter").value;
  const sortOption = document.getElementById("sortOption").value;

  let productItems = Array.from(document.querySelectorAll(".product-item"));

  // Lọc theo tên
  productItems.forEach((product) => {
    const productName = product.getAttribute("data-name").toLowerCase();
    const price = Number(product.getAttribute("data-price"));
    let shouldShow = true;

    // Kiểm tra tên
    if (searchTerm && !productName.includes(searchTerm)) {
      shouldShow = false;
    }

    // Kiểm tra khoảng giá
    if (priceFilter !== "all") {
      const [minPrice, maxPrice] = priceFilter.split("-").map(Number);
      if (price < minPrice || price > maxPrice) {
        shouldShow = false;
      }
    }

    product.style.display = shouldShow ? "" : "none";
  });

  // Sắp xếp
  if (sortOption !== "none") {
    const productList = document.querySelector(".product-list");
    const visibleProducts = productItems.filter(
      (p) => p.style.display !== "none"
    );

    visibleProducts.sort((a, b) => {
      if (sortOption === "name-asc") {
        return a
          .getAttribute("data-name")
          .localeCompare(b.getAttribute("data-name"));
      } else if (sortOption === "name-desc") {
        return b
          .getAttribute("data-name")
          .localeCompare(a.getAttribute("data-name"));
      } else if (sortOption === "price-asc") {
        return (
          Number(a.getAttribute("data-price")) -
          Number(b.getAttribute("data-price"))
        );
      } else if (sortOption === "price-desc") {
        return (
          Number(b.getAttribute("data-price")) -
          Number(a.getAttribute("data-price"))
        );
      }
      return 0;
    });

    // Re-append theo thứ tự mới
    visibleProducts.forEach((product) => {
      productList.appendChild(product);
    });
  }
}

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", filterAndSortProducts);

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    filterAndSortProducts();
  }
});

const priceFilter = document.getElementById("priceFilter");
priceFilter.addEventListener("change", filterAndSortProducts);

const sortOption = document.getElementById("sortOption");
sortOption.addEventListener("change", filterAndSortProducts);

// ========== 4. HIỂN THỊ/ẨN FORM VỚI TRANSITION ==========

function toggleAddProductForm() {
  const addProductForm = document.getElementById("addProductForm");
  addProductForm.classList.toggle("show");

  if (addProductForm.classList.contains("show")) {
    setTimeout(() => {
      addProductForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }
}

const addProductBtn = document.getElementById("addProductBtn");
addProductBtn.addEventListener("click", toggleAddProductForm);

const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click", () => {
  document.getElementById("addProductForm").classList.remove("show");
  document.getElementById("productForm").reset();
});

// ========== 5. VALIDATION VÀ THÊM SẢN PHẨM ==========

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

  // Load lại danh sách để cập nhật index
  loadProductsFromLocalStorage();

  // Reset form và ẩn
  document.getElementById("productForm").reset();
  document.getElementById("addProductForm").classList.remove("show");

  alert(`Đã thêm sản phẩm "${name}" thành công!`);
}

// Gắn sự kiện submit cho form
const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", handleAddProduct);

// ========== 6. LOAD SẢN PHẨM KHI TRANG LOAD ==========

document.addEventListener("DOMContentLoaded", loadProductsFromLocalStorage);
