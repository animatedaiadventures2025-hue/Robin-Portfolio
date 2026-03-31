// ============================================
// Nomad Gear — Main App Logic
// ============================================

// Render star rating
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// Render a single product card
function renderProductCard(product) {
  const badgeHTML = product.badge
    ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>`
    : '';
  const originalPriceHTML = product.originalPrice
    ? `<span class="product-price-original">$${product.originalPrice}</span>`
    : '';

  return `
    <div class="product-card" data-category="${product.category}">
      ${badgeHTML}
      <a href="product.html?id=${product.id}" class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </a>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <a href="product.html?id=${product.id}">
          <h3 class="product-name">${product.name}</h3>
        </a>
        <div class="product-rating">
          <span class="stars">${renderStars(product.rating)}</span>
          <span class="rating-value">${product.rating}</span>
        </div>
        <div class="product-footer">
          <span class="product-price">$${product.price}${originalPriceHTML}</span>
          <button class="btn-add-cart" onclick="addToCartQuick(${product.id})" title="Add to cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Category colors for placeholder images
function getCategoryColor(category) {
  const colors = {
    'Backpacks': 'linear-gradient(135deg, #059669, #10b981)',
    'Tents': 'linear-gradient(135deg, #0284c7, #38bdf8)',
    'Gear': 'linear-gradient(135deg, #d97706, #fbbf24)',
    'Clothing': 'linear-gradient(135deg, #7c3aed, #a78bfa)'
  };
  return colors[category] || 'linear-gradient(135deg, #6b7280, #9ca3af)';
}

// Category emojis
function getCategoryEmoji(category) {
  const emojis = {
    'Backpacks': '🎒',
    'Tents': '⛺',
    'Gear': '🧭',
    'Clothing': '🧥'
  };
  return emojis[category] || '📦';
}

// Quick add to cart from product card
function addToCartQuick(productId) {
  Cart.addItem(productId, 1);
}

// Render all products
function renderProducts(filteredProducts) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (filteredProducts.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>No products found</h3>
        <p>Try a different search or category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredProducts.map(renderProductCard).join('');
}

// Category filtering
function setupFilters() {
  const filters = document.querySelectorAll('.filter-btn');
  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;
      const filtered = category === 'all'
        ? products
        : products.filter(p => p.category === category);

      renderProducts(filtered);
    });
  });
}

// Search functionality
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const activeFilter = document.querySelector('.filter-btn.active');
    const category = activeFilter?.dataset.category || 'all';

    let filtered = category === 'all'
      ? products
      : products.filter(p => p.category === category);

    if (query) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    renderProducts(filtered);
  });
}

// Initialize shop page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-grid')) {
    renderProducts(products);
    setupFilters();
    setupSearch();
  }
});
