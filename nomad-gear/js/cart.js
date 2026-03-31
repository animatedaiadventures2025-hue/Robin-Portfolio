// ============================================
// Nomad Gear — Cart Functionality
// ============================================

const Cart = {
  STORAGE_KEY: 'nomadgear_cart',

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },

  save(items) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.updateBadge();
  },

  addItem(productId, qty = 1, size = null) {
    const items = this.getItems();
    const existing = items.find(i => i.id === productId && i.size === size);

    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 10);
    } else {
      items.push({ id: productId, qty, size });
    }

    this.save(items);
    this.showAddedFeedback();
  },

  removeItem(productId, size = null) {
    const items = this.getItems().filter(i => !(i.id === productId && i.size === size));
    this.save(items);
  },

  updateQuantity(productId, qty, size = null) {
    if (qty < 1) return this.removeItem(productId, size);
    const items = this.getItems();
    const item = items.find(i => i.id === productId && i.size === size);
    if (item) {
      item.qty = Math.min(qty, 10);
      this.save(items);
    }
  },

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.updateBadge();
  },

  getCount() {
    return this.getItems().reduce((sum, item) => sum + item.qty, 0);
  },

  getSubtotal() {
    return this.getItems().reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return product ? sum + product.price * item.qty : sum;
    }, 0);
  },

  getShipping() {
    return this.getSubtotal() >= 100 ? 0 : 9.99;
  },

  getTax() {
    return this.getSubtotal() * 0.08;
  },

  getTotal() {
    return this.getSubtotal() + this.getShipping() + this.getTax();
  },

  updateBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.getCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  showAddedFeedback() {
    const toast = document.getElementById('cart-toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }
  }
};

// Initialize badges on page load
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
