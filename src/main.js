// Main entry point for the wedding invitation app
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import DOMPurify from 'dompurify';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'lazysizes';

// Import modules
import { CONFIG } from './config/config.js';
import { initCalendar } from './modules/calendar.js';
import { initGuestbook } from './modules/guestbook.js';
import { initAttendance } from './modules/attendance.js';
import { initMap } from './modules/map.js';
import { initContact } from './modules/contact.js';
import { initShare } from './modules/share.js';
import { initGallery } from './modules/gallery.js';
import { showNotification } from './utils/notification.js';
import { copyToClipboard } from './utils/clipboard.js';
import './css/main.css';

// Configure Swiper to use modules
Swiper.use([Navigation, Pagination, Autoplay]);

// Initialize Firebase with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = import.meta.env.PROD ? getAnalytics(app) : null;

// Export for use in modules
export { db, DOMPurify };

// Global functions for HTML onclick handlers
window.copyAccount = (accountNumber) => {
  copyToClipboard(accountNumber, '계좌번호가 복사되었습니다.');
};

window.copyURL = () => {
  copyToClipboard(window.location.href, '주소가 복사되었습니다.');
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Initializing wedding invitation app...');
    
    // Initialize all modules
    await Promise.all([
      initCalendar(),
      initGuestbook(db),
      initAttendance(db),
      initMap(),
      initContact(),
      initShare(),
      initGallery()
    ]);
    
    // Setup service worker for PWA
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
    
    // Remove loading state
    document.body.classList.add('loaded');
    
    console.log('Wedding invitation app initialized successfully!');
    
  } catch (error) {
    console.error('Failed to initialize app:', error);
    showNotification('앱 초기화 중 오류가 발생했습니다.', 'error');
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  showNotification('인터넷 연결이 복구되었습니다.', 'success');
});

window.addEventListener('offline', () => {
  showNotification('인터넷 연결이 끊어졌습니다. 일부 기능이 제한될 수 있습니다.', 'warning');
});

// Performance monitoring
if (import.meta.env.DEV) {
  // Log performance metrics in development
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Performance metrics:', {
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
      totalTime: perfData.loadEventEnd - perfData.fetchStart
    });
  });
}