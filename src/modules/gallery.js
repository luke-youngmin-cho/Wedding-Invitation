// Photo gallery module with Swiper integration
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, EffectFade, Lazy } from 'swiper/modules';
import { CONFIG } from '../config/config.js';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

let gallerySwiper;
let currentPhotoIndex = 0;

export async function initGallery() {
  if (!CONFIG.features.gallery) return;
  
  setupMainPhoto();
  setupPhotoGallery();
  setupLazyLoading();
  setupPhotoSliderControls();
}

function setupMainPhoto() {
  const mainPhoto = document.getElementById('mainPhoto');
  if (!mainPhoto) return;
  
  // Set main photo with fallback
  mainPhoto.src = CONFIG.photos.main;
  mainPhoto.onerror = function() {
    this.src = 'https://via.placeholder.com/280x280/ff9a9e/ffffff?text=💑';
  };
  
  // Add loading animation
  mainPhoto.classList.add('loading');
  mainPhoto.onload = function() {
    this.classList.remove('loading');
  };
}

function setupPhotoGallery() {
  const photoTrack = document.getElementById('photoTrack');
  if (!photoTrack) return;
  
  // Clear existing content
  photoTrack.innerHTML = '';
  
  // Create slides from config
  CONFIG.photos.album.forEach((photo, index) => {
    const slide = document.createElement('div');
    slide.className = 'photo-slide swiper-slide';
    slide.innerHTML = `
      <img 
        data-src="${photo}" 
        class="swiper-lazy"
        alt="웨딩사진 ${index + 1}"
        loading="lazy"
      >
      <div class="swiper-lazy-preloader"></div>
    `;
    photoTrack.appendChild(slide);
  });
  
  // Initialize Swiper if we have a container with class 'swiper'
  const swiperContainer = photoTrack.closest('.swiper');
  if (swiperContainer) {
    initSwiper(swiperContainer);
  } else {
    // Fallback to simple slider
    setupSimpleSlider();
  }
}

function initSwiper(container) {
  // Add required wrapper structure if not present
  if (!container.querySelector('.swiper-wrapper')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'swiper-wrapper';
    const slides = container.querySelectorAll('.photo-slide');
    slides.forEach(slide => wrapper.appendChild(slide));
    container.appendChild(wrapper);
  }
  
  // Initialize Swiper
  gallerySwiper = new Swiper(container, {
    modules: [Navigation, Pagination, Autoplay, EffectFade, Lazy],
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    lazy: {
      loadPrevNext: true,
      loadPrevNextAmount: 2
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true
    },
    a11y: {
      prevSlideMessage: '이전 사진',
      nextSlideMessage: '다음 사진',
      firstSlideMessage: '첫 번째 사진',
      lastSlideMessage: '마지막 사진'
    },
    on: {
      init: function() {
        console.log('Gallery Swiper initialized');
      },
      slideChange: function() {
        currentPhotoIndex = this.realIndex;
      }
    }
  });
  
  // Add navigation buttons if not present
  if (!container.querySelector('.swiper-button-next')) {
    const nextBtn = document.createElement('div');
    nextBtn.className = 'swiper-button-next';
    container.appendChild(nextBtn);
    
    const prevBtn = document.createElement('div');
    prevBtn.className = 'swiper-button-prev';
    container.appendChild(prevBtn);
  }
  
  // Add pagination if not present
  if (!container.querySelector('.swiper-pagination')) {
    const pagination = document.createElement('div');
    pagination.className = 'swiper-pagination';
    container.appendChild(pagination);
  }
}

function setupSimpleSlider() {
  const photoTrack = document.getElementById('photoTrack');
  if (!photoTrack) return;
  
  const slides = photoTrack.querySelectorAll('.photo-slide');
  const totalSlides = slides.length;
  
  // Show first slide
  updateSliderPosition();
  
  // Auto-play
  setInterval(() => {
    nextPhoto();
  }, 4000);
}

function setupPhotoSliderControls() {
  // Global functions for HTML onclick handlers
  window.nextPhoto = () => {
    if (gallerySwiper) {
      gallerySwiper.slideNext();
    } else {
      currentPhotoIndex = (currentPhotoIndex + 1) % CONFIG.photos.album.length;
      updateSliderPosition();
    }
  };
  
  window.previousPhoto = () => {
    if (gallerySwiper) {
      gallerySwiper.slidePrev();
    } else {
      currentPhotoIndex = (currentPhotoIndex - 1 + CONFIG.photos.album.length) % CONFIG.photos.album.length;
      updateSliderPosition();
    }
  };
  
  // Touch/swipe support for mobile
  setupTouchSupport();
}

function updateSliderPosition() {
  const photoTrack = document.getElementById('photoTrack');
  if (!photoTrack) return;
  
  const slideWidth = 100;
  const offset = -currentPhotoIndex * slideWidth;
  photoTrack.style.transform = `translateX(${offset}%)`;
  
  // Load current and adjacent images
  const slides = photoTrack.querySelectorAll('.photo-slide img');
  slides.forEach((img, index) => {
    if (Math.abs(index - currentPhotoIndex) <= 1) {
      if (img.dataset.src && !img.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    }
  });
}

function setupLazyLoading() {
  // Use Intersection Observer for lazy loading
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

function setupTouchSupport() {
  const photoSlider = document.querySelector('.photo-slider');
  if (!photoSlider) return;
  
  let touchStartX = 0;
  let touchEndX = 0;
  
  photoSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  photoSlider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextPhoto();
      } else {
        previousPhoto();
      }
    }
  }
}

// Cleanup function
export function cleanupGallery() {
  if (gallerySwiper) {
    gallerySwiper.destroy(true, true);
  }
}