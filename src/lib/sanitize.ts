import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: basic HTML stripping
    return html.replace(/<[^>]*>/g, '');
  }
  
  // Client-side: use DOMPurify
  return DOMPurify.sanitize(html, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

/**
 * Sanitizes plain text input
 */
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 200); // Limit length
}

/**
 * Validates and sanitizes habit names
 */
export function sanitizeHabitName(name: string): string {
  const sanitized = sanitizeText(name);
  if (sanitized.length === 0) {
    throw new Error('Habit name cannot be empty');
  }
  if (sanitized.length > 60) {
    throw new Error('Habit name must be 60 characters or less');
  }
  return sanitized;
}

/**
 * Validates and sanitizes habit descriptions
 */
export function sanitizeHabitDescription(description?: string): string | undefined {
  if (!description) return undefined;
  const sanitized = sanitizeText(description);
  if (sanitized.length > 200) {
    throw new Error('Description must be 200 characters or less');
  }
  return sanitized.length > 0 ? sanitized : undefined;
}
