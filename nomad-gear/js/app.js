// ============================================
// Nomad Gear — Main App Logic
// ============================================

// Render star rating — shows filled stars based on floor, numeric always visible
function renderStars(rating) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
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

// Quick add to cart from product card
function addToCartQuick(productId) {
  Cart.addItem(productId, 1);
}

// Get filtered and sorted products
function getFilteredProducts() {
  const activeFilter = document.querySelector('.filter-btn.active');
  const category = activeFilter?.dataset.category || 'all';
  const searchQuery = document.getElementById('search-input')?.value?.toLowerCase().trim() || '';
  const sortValue = document.getElementById('sort-select')?.value || 'featured';

  let filtered = category === 'all'
    ? [...products]
    : products.filter(p => p.category === category);

  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery)
    );
  }

  // Sort
  switch (sortValue) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return filtered;
}

// Render all products
function renderProducts() {
  const grid = document.getElementById('product-grid');
  const countEl = document.getElementById('product-count');
  if (!grid) return;

  const filtered = getFilteredProducts();

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} of ${products.length} products`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>No products found</h3>
        <p>Try a different search or category.</p>
        <button class="btn btn-outline" onclick="resetFilters()">View All Products</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(renderProductCard).join('');
}

// Reset all filters
function resetFilters() {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn[data-category="all"]')?.classList.add('active');
  document.getElementById('search-input').value = '';
  document.getElementById('sort-select').value = 'featured';
  renderProducts();
}

// Category filtering
function setupFilters() {
  const filters = document.querySelectorAll('.filter-btn');
  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts();
    });
  });

  // Check for filter from localStorage (from nav links)
  const savedFilter = localStorage.getItem('filter');
  if (savedFilter) {
    localStorage.removeItem('filter');
    filters.forEach(b => b.classList.remove('active'));
    const target = document.querySelector(`.filter-btn[data-category="${savedFilter}"]`);
    if (target) {
      target.classList.add('active');
      // Scroll to shop section
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Search functionality
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  let debounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(renderProducts, 200);
  });
}

// Sort functionality
function setupSort() {
  const sortSelect = document.getElementById('sort-select');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', renderProducts);
}

// Mobile menu
function setupMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
}

// Initialize shop page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-grid')) {
    setupMobileMenu();
    setupFilters();
    setupSearch();
    setupSort();
    renderProducts();
  } else {
    // Non-shop pages still need mobile menu
    setupMobileMenu();
  }
});
