document.addEventListener('DOMContentLoaded', () => {
  // Sidebar navigation
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = item.dataset.page;

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      pages.forEach(p => p.classList.remove('active'));
      const target = document.getElementById(`page-${pageId}`);
      if (target) target.classList.add('active');

      // Close mobile sidebar
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });

  // Chart bar hover tooltip
  document.querySelectorAll('.bar').forEach(bar => {
    bar.addEventListener('mouseenter', function() {
      const height = this.style.height;
      const value = Math.round(parseInt(height) * 500);
      this.title = `$${value.toLocaleString()}`;
    });
  });

  // Table row click highlight
  document.querySelectorAll('table tbody tr').forEach(row => {
    row.addEventListener('click', function() {
      document.querySelectorAll('table tbody tr').forEach(r => r.style.background = '');
      this.style.background = '#f1f5f9';
    });
  });

  // Save button demo
  const saveBtn = document.querySelector('.btn-primary');
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      this.textContent = 'Saved!';
      this.style.background = '#22c55e';
      setTimeout(() => {
        this.textContent = 'Save Changes';
        this.style.background = '';
      }, 2000);
    });
  }
});
