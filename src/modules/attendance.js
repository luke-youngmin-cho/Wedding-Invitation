// Attendance/RSVP module with Firebase integration
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import DOMPurify from 'dompurify';
import { CONFIG } from '../config/config.js';
import { showNotification } from '../utils/notification.js';
import { formatPhoneNumber } from '../utils/format.js';

let db;

export async function initAttendance(firestore) {
  if (!CONFIG.features.attendance) return;
  
  db = firestore;
  
  setupAttendanceForm();
  setupAttendanceModal();
  setupFormHelpers();
}

function setupAttendanceForm() {
  const form = document.getElementById('attendanceForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
      submitBtn.disabled = true;
      submitBtn.textContent = '저장 중...';
      
      const formData = new FormData(form);
      const data = {
        name: DOMPurify.sanitize(formData.get('name').trim()),
        phone: DOMPurify.sanitize(formData.get('phone').trim()),
        status: formData.get('status'),
        meal: formData.get('meal'),
        count: parseInt(formData.get('count')) || 1,
        relation: formData.get('relation')
      };
      
      // Validation
      if (!data.name || data.name.length > 50) {
        throw new Error('이름을 올바르게 입력해주세요.');
      }
      
      if (!data.phone || !isValidPhoneNumber(data.phone)) {
        throw new Error('연락처를 올바르게 입력해주세요.');
      }
      
      if (!data.status || !['attend', 'absent'].includes(data.status)) {
        throw new Error('참석 여부를 선택해주세요.');
      }
      
      if (data.count < 1 || data.count > CONFIG.limits.maxAttendees) {
        throw new Error(`참석 인원은 1-${CONFIG.limits.maxAttendees}명 이내로 입력해주세요.`);
      }
      
      // Check for duplicate
      const isDuplicate = await checkDuplicate(data.phone);
      if (isDuplicate) {
        const confirm = window.confirm('이미 등록된 연락처입니다. 정보를 업데이트하시겠습니까?');
        if (!confirm) return;
      }
      
      // Save to Firestore
      await addDoc(collection(db, 'rsvp'), {
        ...data,
        attend: data.status === 'attend' ? 'yes' : 'no',
        totalGuests: data.count,
        side: data.relation,
        ts: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
      
      // Reset form and close modal
      form.reset();
      closeAttendanceModal();
      
      const message = data.status === 'attend' 
        ? '참석 의사를 전달해주셔서 감사합니다! 🙏'
        : '소중한 마음 전달해주셔서 감사합니다! 💕';
      showNotification(message, 'success');
      
    } catch (error) {
      console.error('Failed to save attendance:', error);
      showNotification(error.message || '참석 정보 저장 중 오류가 발생했습니다.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

function setupAttendanceModal() {
  // Open modal
  window.openAttendanceModal = () => {
    const modal = document.getElementById('attendanceModal');
    if (modal) {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      
      // Focus on name input
      setTimeout(() => {
        const nameInput = document.getElementById('attendeeName');
        if (nameInput) nameInput.focus();
      }, 100);
    }
  };
  
  // Close modal
  window.closeAttendanceModal = () => {
    const modal = document.getElementById('attendanceModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  };
  
  // Close on background click
  const modal = document.getElementById('attendanceModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAttendanceModal();
      }
    });
  }
  
  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.style.display === 'block') {
      closeAttendanceModal();
    }
  });
}

function setupFormHelpers() {
  // Phone number formatting
  const phoneInput = document.getElementById('attendeePhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      e.target.value = formatPhoneNumber(e.target.value);
    });
  }
  
  // Status change handler
  const statusSelect = document.getElementById('attendanceStatus');
  const mealSelect = document.getElementById('mealOption');
  const countInput = document.getElementById('guestCount');
  
  if (statusSelect && mealSelect && countInput) {
    statusSelect.addEventListener('change', (e) => {
      if (e.target.value === 'absent') {
        // If absent, disable meal and set count to 0
        mealSelect.value = 'no';
        mealSelect.disabled = true;
        countInput.value = '0';
        countInput.disabled = true;
      } else {
        // If attending, enable options
        mealSelect.disabled = false;
        countInput.disabled = false;
        if (countInput.value === '0') {
          countInput.value = '1';
        }
      }
    });
  }
  
  // Count validation
  if (countInput) {
    countInput.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      if (value > CONFIG.limits.maxAttendees) {
        e.target.value = CONFIG.limits.maxAttendees;
        showNotification(`최대 ${CONFIG.limits.maxAttendees}명까지 입력 가능합니다.`, 'warning');
      } else if (value < 0) {
        e.target.value = 0;
      }
    });
  }
}

async function checkDuplicate(phone) {
  try {
    const q = query(collection(db, 'rsvp'), where('phone', '==', phone));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Failed to check duplicate:', error);
    return false;
  }
}

function isValidPhoneNumber(phone) {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Check if it's a valid Korean phone number
  const mobileRegex = /^01[0-9]{8,9}$/;
  const withAreaCode = /^0[2-9][0-9]{7,9}$/;
  
  return mobileRegex.test(digits) || withAreaCode.test(digits);
}