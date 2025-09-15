/**
 * Vietnamese text processing utilities for removing tone marks and normalizing text
 */

// Vietnamese tone mark mapping
const VIETNAMESE_TONE_MAP: Record<string, string> = {
  // a variations
  'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  
  // e variations
  'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  
  // i variations
  'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  
  // o variations
  'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  
  // u variations
  'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  
  // y variations
  'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
  
  // d variations
  'đ': 'd',
  
  // Uppercase versions
  'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
  'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
  'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
  
  'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
  'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
  
  'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
  
  'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
  'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
  'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
  
  'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
  'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
  
  'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
  
  'Đ': 'D'
};

/**
 * Remove Vietnamese tone marks from a string
 * @param text - The Vietnamese text to process
 * @returns Text without tone marks
 */
export function removeToneMarks(text: string): string {
  return text
    .split('')
    .map(char => VIETNAMESE_TONE_MAP[char] || char)
    .join('');
}

/**
 * Normalize Vietnamese text for processing:
 * - Remove tone marks
 * - Convert to lowercase
 * - Trim whitespace
 * @param text - The Vietnamese text to normalize
 * @returns Normalized text
 */
export function normalizeVietnameseText(text: string): string {
  return removeToneMarks(text.trim()).toLowerCase();
}

/**
 * Convert a Vietnamese full name to email username format
 * Format: PrimaryName + Initials (e.g., "Pham Thanh Tung" -> "tungpt")
 * @param fullName - The full Vietnamese name
 * @returns Username in email format
 */
export function convertNameToUsername(fullName: string): string {
  if (!fullName?.trim()) {
    return '';
  }

  // Normalize the name
  const normalized = normalizeVietnameseText(fullName);
  
  // Split into words and filter out empty strings
  const words = normalized.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length === 0) {
    return '';
  }
  
  if (words.length === 1) {
    return words[0];
  }
  
  // Primary name is the last word
  const primaryName = words[words.length - 1];
  
  // Get initials from all other words
  const initials = words
    .slice(0, -1)
    .map(word => word.charAt(0))
    .join('');
  
  return primaryName + initials;
}

/**
 * Generate unique usernames by adding numeric suffixes for conflicts
 * @param names - Array of full names to process
 * @returns Array of objects with original name and unique username
 */
export function generateUniqueUsernames(names: string[]): Array<{
  originalName: string;
  username: string;
}> {
  const usernameCount = new Map<string, number>();
  const results: Array<{ originalName: string; username: string }> = [];
  
  for (const name of names) {
    const baseUsername = convertNameToUsername(name);
    
    if (!baseUsername) {
      results.push({ originalName: name, username: '' });
      continue;
    }
    
    // Check if username already exists
    const count = usernameCount.get(baseUsername) || 0;
    usernameCount.set(baseUsername, count + 1);
    
    // Add suffix if this is not the first occurrence
    const finalUsername = count === 0 ? baseUsername : `${baseUsername}${count}`;
    
    results.push({
      originalName: name,
      username: finalUsername
    });
  }
  
  return results;
}