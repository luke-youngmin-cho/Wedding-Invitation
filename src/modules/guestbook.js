// Guestbook module with Firebase integration
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, limit } from 'firebase/firestore';
import DOMPurify from 'dompurify';
import { CONFIG } from '../config/config.js';
import { showNotification } from '../utils/notification.js';
import { formatDate } from '../utils/date.js';

let db;
let unsubscribe;

export async function initGuestbook(firestore) {
  if (!CONFIG.features.guestbook) return;
  
  db = firestore;
  
  setupGuestbookForm();
  setupGuestbookModal();
  loadGuestbookEntries();
  setupCharacterCounter();
}

function setupGuestbookForm() {
  const form = document.getElementById('guestbookForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
      submitBtn.disabled = true;
      submitBtn.textContent = '저장 중...';
      
      const formData = new FormData(form);
      const name = DOMPurify.sanitize(formData.get('name').trim());
      const message = DOMPurify.sanitize(formData.get('message').trim());
      
      // Validation
      if (!name || name.length > CONFIG.limits.guestbookNameLength) {
        throw new Error(`이름은 1-${CONFIG.limits.guestbookNameLength}자 이내로 입력해주세요.`);
      }
      
      if (!message || message.length > CONFIG.limits.guestbookMessageLength) {
        throw new Error(`메시지는 1-${CONFIG.limits.guestbookMessageLength}자 이내로 입력해주세요.`);
      }
      
      // Save to Firestore
      await addDoc(collection(db, 'guestbook'), {
        name,
        msg: message,
        ts: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
      
      // Reset form and close modal
      form.reset();
      closeGuestbookModal();
      showNotification('방명록이 등록되었습니다. 감사합니다! 💕', 'success');
      
    } catch (error) {
      console.error('Failed to save guestbook entry:', error);
      showNotification(error.message || '방명록 등록 중 오류가 발생했습니다.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

function setupGuestbookModal() {
  // Open modal button
  window.openGuestbookModal = () => {
    const modal = document.getElementById('guestbookModal');
    if (modal) {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      
      // Focus on name input
      setTimeout(() => {
        const nameInput = document.getElementById('guestName');
        if (nameInput) nameInput.focus();
      }, 100);
    }
  };
  
  // Close modal button
  window.closeGuestbookModal = () => {
    const modal = document.getElementById('guestbookModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  };
  
  // Close on background click
  const modal = document.getElementById('guestbookModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeGuestbookModal();
      }
    });
  }
  
  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.style.display === 'block') {
      closeGuestbookModal();
    }
  });
}

function loadGuestbookEntries() {
  const listContainer = document.getElementById('guestbookList');
  if (!listContainer) return;
  
  // Create query with ordering and limit
  const q = query(
    collection(db, 'guestbook'),
    orderBy('ts', 'desc'),
    limit(100) // Limit to recent 100 entries for performance
  );
  
  // Listen to real-time updates
  unsubscribe = onSnapshot(q, 
    (snapshot) => {
      const entries = [];
      snapshot.forEach((doc) => {
        entries.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      renderGuestbookList(entries);
    },
    (error) => {
      console.error('Failed to load guestbook entries:', error);
      showNotification('방명록을 불러오는 중 오류가 발생했습니다.', 'error');
    }
  );
}

function renderGuestbookList(entries) {
  const listContainer = document.getElementById('guestbookList');
  if (!listContainer) return;
  
  if (entries.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 3em; margin-bottom: 15px;">✍️</div>
        <h4>아직 방명록이 없습니다</h4>
        <p>첫 번째 축하 메시지를 남겨주세요!</p>
      </div>
    `;
    return;
  }
  
  listContainer.innerHTML = entries.map((entry, index) => {
    const date = entry.ts ? formatDate(entry.ts.toDate()) : entry.createdAt || '';
    const number = String(entries.length - index).padStart(3, '0');
    
    return `
      <div class="guestbook-item" data-id="${entry.id}">
        <div class="guest-name">${DOMPurify.sanitize(entry.name)}</div>
        <div class="guest-message">${DOMPurify.sanitize(entry.msg)}</div>
        <div class="guest-footer">
          <span class="guest-date">${date}</span>
          <span class="guest-number">#${number}</span>
        </div>
      </div>
    `;
  }).join('');
  
  // Add animation to new items
  const items = listContainer.querySelectorAll('.guestbook-item');
  items.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('fade-in');
    }, index * 50);
  });
}

function setupCharacterCounter() {
  const textarea = document.getElementById('guestMessage');
  if (!textarea) return;
  
  const maxLength = CONFIG.limits.guestbookMessageLength;
  
  // Create counter element
  const counter = document.createElement('div');
  counter.className = 'char-counter';
  counter.textContent = `0/${maxLength}`;
  
  // Insert after textarea
  textarea.parentNode.insertBefore(counter, textarea.nextSibling);
  
  // Update counter on input
  textarea.addEventListener('input', () => {
    const currentLength = textarea.value.length;
    counter.textContent = `${currentLength}/${maxLength}`;
    
    if (currentLength > maxLength * 0.9) {
      counter.style.color = '#ff6b6b';
    } else {
      counter.style.color = '#666';
    }
    
    // Prevent typing beyond limit
    if (currentLength > maxLength) {
      textarea.value = textarea.value.substring(0, maxLength);
      counter.textContent = `${maxLength}/${maxLength}`;
    }
  });
}

// Cleanup function
export function cleanupGuestbook() {
  if (unsubscribe) {
    unsubscribe();
  }
}