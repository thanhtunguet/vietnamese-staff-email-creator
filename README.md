# Vietnamese Staff Email Creator

A web application designed to help Vietnamese HR professionals create staff email addresses from Excel files using Vietnamese naming conventions.

## Overview

This tool automates the process of generating email addresses for Vietnamese staff members by converting their full names into standardized email usernames. It handles the complexities of Vietnamese naming conventions, tone mark removal, and conflict resolution.

## How It Works

### Name Conversion Process

Vietnamese names are converted to email usernames using this pattern: `PrimaryName + Initials`

**Examples:**
- Pham Thanh Tung → TungPT
- Tran Thanh Thao → ThaoTT  
- Le Minh Thanh → ThanhLM

### Processing Steps

1. **Tone Mark Removal**: Removes Vietnamese diacritics and converts to lowercase
2. **Name Reordering**: Places the primary name (last word) first, followed by initials of other words
3. **Conflict Resolution**: Adds numeric suffixes when duplicate usernames are detected
4. **Domain Combination**: Combines username with company domain for complete email addresses

### Conflict Example
- First person: Tran Phuong Thao → ThaoTP → thaotp@company.com
- Second person: Ta Phuong Thao → ThaoTP1 → thaotp1@company.com

## Features

- **Excel File Upload**: Support for .xlsx and .xls files
- **Sheet Selection**: Choose from multiple worksheets
- **Column Selection**: Pick the column containing staff names
- **Header Detection**: Optional "First row is header" setting (enabled by default)
- **Batch Processing**: Process multiple names simultaneously
- **Automatic Download**: Generate and download updated Excel file with email usernames

## Technology Stack

- **Frontend**: React with Ant Design components
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **File Processing**: Excel file handling for import/export

## Development

### Prerequisites
- Node.js and npm

### Setup
```bash
npm install
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run lint` - Run ESLint

## Usage

1. **Upload Excel File**: Select your Excel file containing staff names
2. **Configure Settings**: 
   - Choose the worksheet
   - Select the column with names
   - Set header row option if needed
3. **Process**: The app will generate usernames for all names in the selected column
4. **Download**: Get the updated Excel file with a new column containing the email usernames

## Target Users

This application is specifically designed for Vietnamese HR professionals who need to create email addresses in batches but may not have advanced Excel skills or templates for handling Vietnamese name processing.