// Lightbox
document.addEventListener('DOMContentLoaded', () => {
  // Create lightbox overlay
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-overlay"></div>
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
      <button class="lightbox-next" aria-label="Next">&#8250;</button>
      <img class="lightbox-img" src="" alt="">
      <p class="lightbox-caption"></p>
    </div>
  `;
  document.body.appendChild(lightbox);

  const overlay = lightbox.querySelector('.lightbox-overlay');
  const img = lightbox.querySelector('.lightbox-img');
  const caption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let galleryImages = [];
  let currentIndex = 0;

  // Collect all gallery images
  function collectImages() {
    galleryImages = [];
    document.querySelectorAll('.gallery-item img').forEach((el, i) => {
      galleryImages.push({ src: el.src, alt: el.alt });
      el.style.cursor = 'pointer';
      el.setAttribute('data-lightbox-index', i);
    });
  }
  collectImages();

  function openLightbox(index) {
    currentIndex = index;
    img.src = galleryImages[index].src;
    caption.textContent = galleryImages[index].alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    img.src = galleryImages[currentIndex].src;
    caption.textContent = galleryImages[currentIndex].alt || '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    img.src = galleryImages[currentIndex].src;
    caption.textContent = galleryImages[currentIndex].alt || '';
  }

  // Event listeners
  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const index = parseInt(item.querySelector('img')?.getAttribute('data-lightbox-index') || 0);
      openLightbox(index);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
});
