let allProducts = [];
const productShow = document.getElementById("product-showcase");
const sortDropdown = document.getElementById("sort-dropdown");
const filterDropdown = document.getElementById("filter-dropdown");
const searchInput = document.getElementById("search-input");

const fetchProducts = async () => {
    const res = await fetch("https://fakestoreapi.com/products");
    allProducts = await res.json();
    updateUI();
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

const displayProducts = (products) => {
    productShow.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" class="product-image" alt="${p.title}">
            <h3 class="product-title" style="overflow-y:auto">${p.title}</h3>
            <p class="product-rating">${p.rating.rate} &#11088;</p>
            <p class="product-price">$${p.price}</p>
        </div>
    `).join("");
};

sortDropdown.addEventListener("change", updateUI);
filterDropdown.addEventListener("change", updateUI);
searchInput.addEventListener("input", updateUI);

fetchProducts();

