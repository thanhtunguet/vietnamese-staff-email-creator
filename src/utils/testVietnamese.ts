/**
 * Test utilities for Vietnamese name processing
 */

import { convertNameToUsername, generateUniqueUsernames } from './vietnamese';

// Test cases from requirements
export const TEST_CASES = [
  { input: 'Pham Thanh Tung', expected: 'tungpt' },
  { input: 'Tran Thanh Thao', expected: 'thaott' }, 
  { input: 'Le Minh Thanh', expected: 'thanhlm' },
  { input: 'Tran Phuong Thao', expected: 'thaotp' },
  { input: 'Ta Phuong Thao', expected: 'thaotp' }, // Will get suffix in batch processing
];

/**
 * Run basic test cases and return results
 */
export function runBasicTests() {
  const results = TEST_CASES.map(test => {
    const actual = convertNameToUsername(test.input);
    return {
      name: test.input,
      expected: test.expected,
      actual,
      passed: actual === test.expected
    };
  });

  console.log('Vietnamese Name Processing Test Results:');
  results.forEach(result => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}: ${result.actual} (expected: ${result.expected})`);
  });

  return results;
}

/**
 * Test conflict resolution
 */
export function testConflictResolution() {
  const names = ['Tran Phuong Thao', 'Ta Phuong Thao'];
  const results = generateUniqueUsernames(names);
  
  console.log('Conflict Resolution Test:');
  results.forEach(result => {
    console.log(`"${result.originalName}" → "${result.username}"`);
  });
  
  const passed = results[0].username === 'thaotp' && results[1].username === 'thaotp1';
  console.log(`Result: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return { results, passed };
}
