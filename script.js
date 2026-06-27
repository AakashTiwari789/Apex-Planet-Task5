let allProducts = [];
const productShow = document.getElementById("product-showcase");
const sortDropdown = document.getElementById("sort-dropdown");
const filterDropdown = document.getElementById("filter-dropdown");
const searchInput = document.getElementById("search-input");

const loader = document.getElementById("loader");

const errorMessage = document.getElementById("error-message");
const retryBtn = document.getElementById("retry-btn");

const fetchProducts = async () => {
    loader.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    productShow.innerHTML = "";

    try {
        const res = await fetch("https://fakestoreapi.com/products");

        if (!res.ok) {
            throw new Error("Network response was not ok");
        }

        allProducts = await res.json();

        updateUI();

    } catch (error) {
        errorMessage.classList.remove("hidden");
        console.error(error);

    } finally {
        loader.classList.add("hidden");
    }
};

const updateUI = () => {
    let filtered = allProducts.filter(product => {
        const categoryMatch =
            filterDropdown.value === "all" ||
            product.category === filterDropdown.value;

        const searchMatch =
            product.title.toLowerCase().includes(searchInput.value.toLowerCase());

        return categoryMatch && searchMatch;
    });

    const sortVal = sortDropdown.value;
    if (sortVal === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sortVal === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (sortVal === "rating-desc") filtered.sort((a, b) => b.rating.rate - a.rating.rate);
    if (sortVal === "rating-asc") filtered.sort((a, b) => a.rating.rate - b.rating.rate);

    displayProducts(filtered);
};

sortDropdown.addEventListener("change", updateUI);
filterDropdown.addEventListener("change", updateUI);
searchInput.addEventListener("input", updateUI);
retryBtn.addEventListener("click", fetchProducts);


// Opening the product details page when a product card is clicked
const modal = document.getElementById("product-modal");
const closeModal = document.getElementById("close-modal");

const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalCategory = document.getElementById("modal-category");
const modalRating = document.getElementById("modal-rating");
const modalPrice = document.getElementById("modal-price");

function openModal(product) {
    modalImage.src = product.image;
    modalTitle.textContent = product.title;
    modalDescription.textContent = product.description;
    modalCategory.textContent = product.category;
    modalRating.textContent = product.rating.rate;
    modalPrice.textContent = "$" + product.price;
    modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});

const displayProducts = (products) => {
    productShow.innerHTML = products.map((p, index) => {
        return `
            <div class="product-card" data-index="${index}">

                <img
                    src="${p.image}"
                    class="product-image loading"
                    loading="lazy"
                    alt="${p.title}"
                    onload="this.classList.remove('loading')"
                />

                <h3 class="product-title">${p.title}</h3>

                <p>⭐ ${p.rating.rate}</p>

                <p class="product-price">$${p.price}</p>

                <button
                    class="add-cart-btn"
                    data-index="${index}">
                    Add to Cart
                </button>
            </div>`;
    }).join("");

    const cards = document.querySelectorAll(".product-card");

    cards.forEach((card, index) => {
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("add-cart-btn"))
                return;
            openModal(products[index]);
        });
    });

    document.querySelectorAll(".add-cart-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            addToCart(products[index]);
        });
    });
};

// Adding the cart functionality

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const toast = document.getElementById("toast");

const cartCount = document.getElementById("cart-count");
function updateCartCount() {
    cartCount.textContent = cart.length;
}

function addToCart(product) {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
        showToast("Product already in cart!", "error");
        return;
    }
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showToast("Product added to cart!");
};

function showToast(message, type = "success") {
    toast.textContent = message;
    toast.className = "";
    toast.classList.add(type);
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

updateCartCount();
fetchProducts();