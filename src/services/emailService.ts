/**
 * Email service for processing Vietnamese names to email usernames
 */

import { generateUniqueUsernames } from '../utils/vietnamese';

export interface EmailProcessingResult {
  originalName: string;
  username: string;
  email?: string;
}

export interface ProcessingOptions {
  domain?: string;
  includeEmails?: boolean;
}

/**
 * Process an array of Vietnamese names to generate unique usernames and optionally email addresses
 * @param names - Array of full names to process
 * @param options - Processing options including domain and email generation
 * @returns Array of processing results
 */
export function processNamesToEmails(
  names: string[],
  options: ProcessingOptions = {}
): EmailProcessingResult[] {
  const { domain, includeEmails = false } = options;
  
  // Generate unique usernames
  const usernameResults = generateUniqueUsernames(names);
  
  // Convert to email processing results
  return usernameResults.map(result => {
    const emailResult: EmailProcessingResult = {
      originalName: result.originalName,
      username: result.username,
    };
    
    // Add email if domain is provided and emails are requested
    if (includeEmails && domain && result.username) {
      emailResult.email = `${result.username}@${domain}`;
    }
    
    return emailResult;
  });
}

/**
 * Validate if a string could be a valid domain
 * @param domain - Domain string to validate
 * @returns Boolean indicating if domain appears valid
 */
export function isValidDomain(domain: string): boolean {
  if (!domain?.trim()) {
    return false;
  }
  
  // Basic domain validation regex
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/;
  return domainRegex.test(domain.trim());
}

/**
 * Generate sample data for testing
 * @returns Array of sample Vietnamese names
 */
export function getSampleVietnameseNames(): string[] {
  return [
    'Pham Thanh Tung',
    'Tran Thanh Thao',
    'Le Minh Thanh',
    'Nguyen Van An',
    'Hoang Thi Mai',
    'Tran Phuong Thao',
    'Ta Phuong Thao',
    'Vu Minh Duc',
    'Dang Thi Lan',
    'Bui Van Long'
  ];
}