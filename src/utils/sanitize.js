// Security utilities for sanitizing user input
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - The potentially unsafe HTML string
 * @param {Object} config - DOMPurify configuration options
 * @returns {string} - The sanitized HTML string
 */
export function sanitizeHTML(dirty, config = {}) {
  const defaultConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p', 'span'],
    ALLOWED_ATTR: ['class', 'style'],
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true,
    SAFE_FOR_TEMPLATES: true
  };
  
  return DOMPurify.sanitize(dirty, { ...defaultConfig, ...config });
}

/**
 * Sanitize plain text (no HTML allowed)
 * @param {string} text - The text to sanitize
 * @returns {string} - The sanitized text
 */
export function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
}

/**
 * Escape HTML special characters
 * @param {string} text - The text to escape
 * @returns {string} - The escaped text
 */
export function escapeHTML(text) {
  if (typeof text !== 'string') return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  
  return text.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Validate and sanitize phone number
 * @param {string} phone - The phone number to validate
 * @returns {string} - The sanitized phone number
 */
export function sanitizePhoneNumber(phone) {
  if (typeof phone !== 'string') return '';
  
  // Remove all non-digit characters except hyphens
  const cleaned = phone.replace(/[^\d-]/g, '');
  
  // Validate Korean phone number format
  const mobileRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
  const landlineRegex = /^0[2-9][0-9]-?\d{3,4}-?\d{4}$/;
  
  if (mobileRegex.test(cleaned) || landlineRegex.test(cleaned)) {
    return cleaned;
  }
  
  return '';
}

/**
 * Validate and sanitize email address
 * @param {string} email - The email to validate
 * @returns {string} - The sanitized email
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  
  if (emailRegex.test(trimmed)) {
    return trimmed;
  }
  
  return '';
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 * @param {string} url - The URL to sanitize
 * @returns {string} - The sanitized URL
 */
export function sanitizeURL(url) {
  if (typeof url !== 'string') return '';
  
  const trimmed = url.trim();
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = trimmed.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '';
    }
  }
  
  // Only allow http, https, tel, mailto, and relative URLs
  const allowedProtocols = /^(https?:\/\/|tel:|mailto:|\/|#)/i;
  
  if (allowedProtocols.test(trimmed) || !trimmed.includes(':')) {
    return encodeURI(trimmed);
  }
  
  return '';
}

/**
 * Sanitize user input for Firebase
 * @param {any} input - The input to sanitize
 * @returns {any} - The sanitized input
 */
export function sanitizeForFirebase(input) {
  if (input === null || input === undefined) {
    return '';
  }
  
  if (typeof input === 'string') {
    // Remove control characters and trim
    return input
      .replace(/[\x00-\x1F\x7F]/g, '')
      .trim()
      .slice(0, 10000); // Limit length
  }
  
  if (typeof input === 'number') {
    // Ensure number is finite and within safe range
    if (!Number.isFinite(input)) return 0;
    return Math.max(Math.min(input, Number.MAX_SAFE_INTEGER), Number.MIN_SAFE_INTEGER);
  }
  
  if (typeof input === 'boolean') {
    return input;
  }
  
  if (Array.isArray(input)) {
    return input.map(item => sanitizeForFirebase(item));
  }
  
  if (typeof input === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(input)) {
      // Skip dangerous keys
      if (key.startsWith('__') || key.startsWith('$')) continue;
      sanitized[sanitizeText(key)] = sanitizeForFirebase(value);
    }
    return sanitized;
  }
  
  return '';
}

/**
 * Create Content Security Policy meta tag
 * @returns {string} - CSP meta tag HTML
 */
export function getCSPMetaTag() {
  const policy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.gstatic.com https://apis.google.com https://developers.kakao.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://firebaseapp.com https://firebaseio.com https://googleapis.com wss://*.firebaseio.com",
    "frame-src 'self' https://map.naver.com https://map.kakao.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  return `<meta http-equiv="Content-Security-Policy" content="${policy}">`;
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }
  
  isAllowed(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Clean old entries
    for (const [key, timestamps] of this.requests.entries()) {
      const filtered = timestamps.filter(t => t > windowStart);
      if (filtered.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, filtered);
      }
    }
    
    // Check current identifier
    const timestamps = this.requests.get(identifier) || [];
    const recentRequests = timestamps.filter(t => t > windowStart);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }
  
  reset(identifier) {
    this.requests.delete(identifier);
  }
}