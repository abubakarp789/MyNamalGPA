import DOMPurify from 'dompurify';

/**
 * Sanitizes user input to prevent XSS attacks
 * Removes all HTML tags and dangerous content
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // First, use DOMPurify to sanitize
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true,
  });
  
  // Additional manual sanitization for PDF injection prevention
  return sanitized
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/\\/g, '\\') // Escape backslashes
    .trim();
}

/**
 * Validates that a value is a safe string without dangerous content
 */
export function isSafeString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  
  // Check for dangerous patterns
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(value));
}

/**
 * Safe JSON parse with prototype pollution protection
 * Uses a reviver function to prevent __proto__ and constructor pollution
 */
export function safeJSONParse<T>(text: string, defaultValue: T): T {
  try {
    const result = JSON.parse(text, (key, value) => {
      // Prevent prototype pollution
      if (key === '__proto__' || key === 'constructor') {
        return undefined;
      }
      return value;
    });
    return result;
  } catch (error) {
    console.warn('JSON parse error:', error);
    return defaultValue;
  }
}

/**
 * Sanitizes text for PDF output to prevent injection
 */
export function sanitizeForPDF(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // Remove PDF control characters and potentially dangerous content
  // eslint-disable-next-line no-control-regex
  return text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    .replace(/[()\\]/g, '\\$&') // Escape PDF special characters
    .substring(0, 100); // Limit length
}

/**
 * Generates a cryptographically secure unique ID
 * Uses crypto.randomUUID() when available, falls back to secure random
 */
export function generateSecureId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for environments without crypto.randomUUID
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Last resort fallback (not cryptographically secure)
    for (let i = 0; i < 16; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates URL parameter data structure
 */
export function validateSharedData(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  
  const d = data as Record<string, unknown>;
  
  // Check courses array
  if (d.c && Array.isArray(d.c)) {
    for (const course of d.c) {
      if (typeof course !== 'object' || course === null) return false;
      const c = course as Record<string, unknown>;
      if (typeof c.n !== 'string' || typeof c.cr !== 'number') return false;
      if (c.cr < 1 || c.cr > 30) return false; // Reasonable credit hour limits
    }
  }
  
  // Check grades array
  if (d.g && Array.isArray(d.g)) {
    for (const grade of d.g) {
      if (typeof grade !== 'object' || grade === null) return false;
      const g = grade as Record<string, unknown>;
      if (typeof g.i !== 'number' || typeof g.g !== 'string') return false;
    }
  }
  
  // Check semesters array
  if (d.s && Array.isArray(d.s)) {
    for (const sem of d.s) {
      if (typeof sem !== 'object' || sem === null) return false;
      const s = sem as Record<string, unknown>;
      if (typeof s.n !== 'string' || typeof s.cr !== 'number' || typeof s.g !== 'number') return false;
      if (s.cr < 1 || s.cr > 50) return false; // Reasonable limits
      if (s.g < 0 || s.g > 4) return false; // GPA must be 0-4
    }
  }
  
  return true;
}

/**
 * Validates that clipboard API is available and in a secure context
 */
export function isClipboardAvailable(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function' &&
    (window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost')
  );
}