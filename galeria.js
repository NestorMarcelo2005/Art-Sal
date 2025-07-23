document.addEventListener("DOMContentLoaded", function() {
      // Lightbox functionality
      const lightbox = document.querySelector('.lightbox');
      const lightboxImage = document.querySelector('.lightbox-image');
      const lightboxTitle = document.querySelector('.lightbox-title');
      const lightboxCategory = document.querySelector('.lightbox-category');
      const lightboxClose = document.querySelector('.lightbox-close');
      const lightboxPrev = document.querySelector('.lightbox-prev');
      const lightboxNext = document.querySelector('.lightbox-next');
      
      // Get all gallery items
      const galleryItems = document.querySelectorAll('.gallery-item');
      let currentIndex = 0;
      let images = [];
      
      // Create array of image data
      galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-item-title')?.textContent || '';
        const category = item.querySelector('.gallery-item-category')?.textContent || '';
        const categories = item.dataset.categories;
        
        images.push({
          src: img.src,
          alt: img.alt,
          title: title,
          category: category,
          categories: categories
        });
        
        // Add click event to each gallery item
        item.addEventListener('click', () => {
          openLightbox(index);
        });
      });
      
      // Open lightbox with specific image
      function openLightbox(index) {
        currentIndex = index;
        const image = images[index];
        
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxTitle.textContent = image.title;
        lightboxCategory.textContent = image.category;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      }
      
      // Close lightbox
      function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Enable scrolling
      }
      
      // Navigate to previous image
      function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openLightbox(currentIndex);
      }
      
      // Navigate to next image
      function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        openLightbox(currentIndex);
      }
      
      // Event listeners
      lightboxClose.addEventListener('click', closeLightbox);
      lightboxPrev.addEventListener('click', prevImage);
      lightboxNext.addEventListener('click', nextImage);
      
      // Close lightbox when clicking outside the image
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
          if (e.key === 'Escape') {
            closeLightbox();
          } else if (e.key === 'ArrowLeft') {
            prevImage();
          } else if (e.key === 'ArrowRight') {
            nextImage();
          }
        }
      });
      
      // Filter functionality
      const filterBtns = document.querySelectorAll('.filter-btn');
      const selectedFilters = document.getElementById('selectedFilters');
      let activeFilters = new Set();
      
      // Initialize "all" as active
      activeFilters.add('all');
      updateSelectedFilters();
      
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const filter = btn.dataset.filter;
          
          if (filter === 'all') {
            // Clear all filters and select "all"
            activeFilters.clear();
            activeFilters.add('all');
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          } else {
            // Toggle the filter
            if (activeFilters.has('all')) {
              activeFilters.clear();
            }
            
            if (activeFilters.has(filter)) {
              activeFilters.delete(filter);
              btn.classList.remove('active');
            } else {
              activeFilters.add(filter);
              btn.classList.add('active');
            }
            
            // If no filters selected, activate "all"
            if (activeFilters.size === 0) {
              activeFilters.add('all');
              filterBtns.forEach(b => {
                if (b.dataset.filter === 'all') {
                  b.classList.add('active');
                } else {
                  b.classList.remove('active');
                }
              });
            } else {
              // Ensure "all" is not active
              document.querySelector('.filter-btn[data-filter="all"]').classList.remove('active');
            }
          }
          
          updateSelectedFilters();
          filterImages();
        });
      });
      
      // Update selected filters display
      function updateSelectedFilters() {
        selectedFilters.innerHTML = '';
        
        if (activeFilters.has('all') || activeFilters.size === 0) {
          const tag = document.createElement('div');
          tag.className = 'filter-tag';
          tag.innerHTML = 'Todas as categorias';
          selectedFilters.appendChild(tag);
        } else {
          activeFilters.forEach(filter => {
            if (filter !== 'all') {
              const tag = document.createElement('div');
              tag.className = 'filter-tag';
              tag.innerHTML = `${filter} <span class="filter-tag-remove" data-filter="${filter}">×</span>`;
              selectedFilters.appendChild(tag);
            }
          });
        }
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.filter-tag-remove').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const filterToRemove = btn.dataset.filter;
            activeFilters.delete(filterToRemove);
            
            // Update button states
            document.querySelector(`.filter-btn[data-filter="${filterToRemove}"]`).classList.remove('active');
            
            // If no filters left, activate "all"
            if (activeFilters.size === 0) {
              activeFilters.add('all');
              document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
            }
            
            updateSelectedFilters();
            filterImages();
          });
        });
      }
      
      // Filter images based on active filters
      function filterImages() {
        galleryItems.forEach(item => {
          const itemCategories = item.dataset.categories.split(' ');
          
          if (activeFilters.has('all') || 
              Array.from(activeFilters).some(filter => itemCategories.includes(filter))) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = 1;
              item.style.transform = 'translateY(0)';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      }
    });