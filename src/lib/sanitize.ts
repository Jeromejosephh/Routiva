// src/lib/sanitize.ts
import DOMPurify from 'dompurify';

/**
 * Sanitizes habit names to prevent XSS and normalize input
 */
export function sanitizeHabitName(name: string | undefined): string {
  if (!name) return '';
  
  // Basic sanitization for habit names - remove dangerous characters
  const sanitized = name
    .trim()
    .replace(/[<>"/\\&]/g, '') // Remove potentially dangerous characters
    .substring(0, 60); // Enforce max length
  
  return sanitized;
}

/**
 * Sanitizes habit descriptions with more permissive rules
 */
export function sanitizeHabitDescription(description: string | undefined): string | undefined {
  if (!description) return undefined;
  
  // In server environment, DOMPurify might not be available
  // Fallback to basic sanitization
  if (typeof window === 'undefined') {
    return description
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .substring(0, 200); // Enforce max length
  }
  
  // Client-side: use DOMPurify for better sanitization
  const sanitized = DOMPurify.sanitize(description, {
    ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  });
  
  return sanitized.substring(0, 200);
}
