/**
 * Excel file processing service using xlsx library
 */

import * as XLSX from 'xlsx';
import { EmailProcessingResult, processNamesToEmails } from './emailService';

export interface WorksheetInfo {
  name: string;
  rowCount: number;
  columnCount: number;
}

export interface ColumnInfo {
  index: number;
  header: string;
  sampleValues: string[];
}

export interface ProcessingConfig {
  sheetName: string;
  columnIndex: number;
  hasHeader: boolean;
  domain?: string;
}

/**
 * Read Excel file from File object and return workbook
 * @param file - Excel file to read
 * @returns Promise resolving to XLSX workbook
 */
export async function readExcelFile(file: File): Promise<XLSX.WorkBook> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve(workbook);
      } catch (error) {
        reject(new Error('Failed to read Excel file: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Get information about all worksheets in a workbook
 * @param workbook - XLSX workbook
 * @returns Array of worksheet information
 */
export function getWorksheetInfo(workbook: XLSX.WorkBook): WorksheetInfo[] {
  return workbook.SheetNames.map(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    
    return {
      name: sheetName,
      rowCount: range.e.r + 1,
      columnCount: range.e.c + 1
    };
  });
}

/**
 * Get column information from a specific worksheet
 * @param workbook - XLSX workbook
 * @param sheetName - Name of the worksheet
 * @param hasHeader - Whether the first row contains headers
 * @returns Array of column information
 */
export function getColumnInfo(
  workbook: XLSX.WorkBook,
  sheetName: string,
  hasHeader: boolean = true
): ColumnInfo[] {
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error(`Worksheet "${sheetName}" not found`);
  }
  
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false }) as string[][];
  
  if (jsonData.length === 0) {
    return [];
  }
  
  const headerRow = hasHeader ? jsonData[0] : [];
  const dataRows = hasHeader ? jsonData.slice(1) : jsonData;
  const maxColumns = Math.max(headerRow.length, ...dataRows.map(row => row.length));
  
  const columns: ColumnInfo[] = [];
  
  for (let i = 0; i < maxColumns; i++) {
    const header = hasHeader ? (headerRow[i] || `Column ${i + 1}`) : `Column ${i + 1}`;
    
    // Get sample values from this column (max 5 non-empty values)
    const sampleValues: string[] = [];
    for (const row of dataRows) {
      if (row[i] && row[i].toString().trim()) {
        sampleValues.push(row[i].toString().trim());
        if (sampleValues.length >= 5) break;
      }
    }
    
    columns.push({
      index: i,
      header,
      sampleValues
    });
  }
  
  return columns;
}

/**
 * Extract names from a specific column in a worksheet
 * @param workbook - XLSX workbook
 * @param sheetName - Name of the worksheet
 * @param columnIndex - Index of the column containing names
 * @param hasHeader - Whether to skip the first row
 * @returns Array of names from the column
 */
export function extractNamesFromColumn(
  workbook: XLSX.WorkBook,
  sheetName: string,
  columnIndex: number,
  hasHeader: boolean = true
): string[] {
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error(`Worksheet "${sheetName}" not found`);
  }
  
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false }) as string[][];
  
  if (jsonData.length === 0) {
    return [];
  }
  
  const dataRows = hasHeader ? jsonData.slice(1) : jsonData;
  
  return dataRows
    .map(row => row[columnIndex]?.toString().trim() || '')
    .filter(name => name.length > 0);
}

/**
 * Create a new workbook with processed email data
 * @param originalWorkbook - Original XLSX workbook
 * @param config - Processing configuration
 * @param processedData - Processed email results
 * @returns New workbook with username column added
 */
export function createProcessedWorkbook(
  originalWorkbook: XLSX.WorkBook,
  config: ProcessingConfig,
  processedData: EmailProcessingResult[]
): XLSX.WorkBook {
  const worksheet = originalWorkbook.Sheets[config.sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false }) as any[][];
  
  if (jsonData.length === 0) {
    throw new Error('No data found in worksheet');
  }
  
  // Add username header
  const usernameHeader = config.hasHeader ? 'Username' : '';
  if (config.hasHeader && jsonData[0]) {
    jsonData[0].splice(config.columnIndex + 1, 0, usernameHeader);
  }
  
  // Add email header if domain is provided
  const emailHeader = config.hasHeader && config.domain ? 'Email' : '';
  if (emailHeader && jsonData[0]) {
    jsonData[0].splice(config.columnIndex + 2, 0, emailHeader);
  }
  
  // Add usernames to data rows
  const startRow = config.hasHeader ? 1 : 0;
  let dataIndex = 0;
  
  for (let i = startRow; i < jsonData.length && dataIndex < processedData.length; i++) {
    const result = processedData[dataIndex];
    
    // Insert username
    jsonData[i].splice(config.columnIndex + 1, 0, result.username);
    
    // Insert email if available
    if (result.email) {
      jsonData[i].splice(config.columnIndex + 2, 0, result.email);
    }
    
    dataIndex++;
  }
  
  // Create new worksheet
  const newWorksheet = XLSX.utils.aoa_to_sheet(jsonData);
  
  // Create new workbook
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, config.sheetName);
  
  return newWorkbook;
}

/**
 * Download workbook as Excel file
 * @param workbook - XLSX workbook to download
 * @param filename - Name for the downloaded file
 */
export function downloadWorkbook(workbook: XLSX.WorkBook, filename: string = 'processed_staff_emails.xlsx'): void {
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Process Excel file end-to-end: read file, extract names, process to usernames, create new workbook
 * @param file - Excel file to process
 * @param config - Processing configuration
 * @returns Promise resolving to processed results and new workbook
 */
export async function processExcelFile(
  file: File,
  config: ProcessingConfig
): Promise<{
  processedData: EmailProcessingResult[];
  newWorkbook: XLSX.WorkBook;
}> {
  // Read the original file
  const originalWorkbook = await readExcelFile(file);
  
  // Extract names from the specified column
  const names = extractNamesFromColumn(
    originalWorkbook,
    config.sheetName,
    config.columnIndex,
    config.hasHeader
  );
  
  // Process names to generate usernames and emails
  const processedData = processNamesToEmails(names, {
    domain: config.domain,
    includeEmails: !!config.domain
  });
  
  // Create new workbook with processed data
  const newWorkbook = createProcessedWorkbook(originalWorkbook, config, processedData);
  
  return { processedData, newWorkbook };
}