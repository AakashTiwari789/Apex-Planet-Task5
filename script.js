let allProducts = [];
const productShow = document.getElementById("product-showcase");
const sortDropdown = document.getElementById("sort-dropdown");
const filterDropdown = document.getElementById("filter-dropdown");

const fetchProducts = async () => {
    const res = await fetch("https://fakestoreapi.com/products");
    allProducts = await res.json();
    updateUI();
};

const updateUI = () => {
    let filtered = allProducts.filter(p =>
        filterDropdown.value === "all" ? true : p.category === filterDropdown.value
    );

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

fetchProducts();