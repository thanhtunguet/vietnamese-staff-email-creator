# Vietnamese Staff Email Creator - Implementation Plan

## Project Overview
Build a web application to convert Vietnamese staff names from Excel files into email usernames following Vietnamese enterprise naming conventions.

## Core Features
1. **Vietnamese Name Processing**
   - Remove tone marks from Vietnamese characters
   - Convert names to email format: `PrimaryName + Initials`
   - Handle conflicts with numeric suffixes

2. **Excel Integration** 
   - Upload Excel files (.xlsx/.xls)
   - Select worksheet and name column
   - Process names and add username column
   - Download updated workbook

3. **User Interface**
   - Clean, professional design with Ant Design
   - Responsive layout with Tailwind CSS
   - Step-by-step workflow
   - Real-time preview of conversions

## Implementation Steps

### Phase 1: Foundation & Setup
- Set up Tailwind CSS integration
- Create Vietnamese text processing utilities (tone mark removal)
- Implement core name-to-username conversion algorithm

### Phase 2: Excel Processing
- Build Excel file reading/writing utilities using xlsx library
- Create worksheet and column selection logic
- Implement batch name processing with conflict resolution

### Phase 3: User Interface
- Design main layout with upload area
- Build file upload component with drag-and-drop
- Create sheet/column selection interface
- Add processing preview and results display

### Phase 4: Integration & Polish
- Connect all components together
- Add comprehensive error handling
- Implement file download functionality
- Test with real Vietnamese names and edge cases
- Polish responsive design and user experience

## Technical Approach
- **Frontend**: React + TypeScript for type safety
- **Styling**: Ant Design components + Tailwind CSS utilities
- **File Processing**: xlsx library for Excel manipulation
- **Text Processing**: Custom Vietnamese text utilities
- **State Management**: React hooks and local state

## Example Conversions
- Pham Thanh Tung → TungPT
- Tran Thanh Thao → ThaoTT  
- Le Minh Thanh → ThanhLM
- Tran Phuong Thao → ThaoTP
- Ta Phuong Thao → ThaoTP1 (conflict resolution)

## User Workflow
1. Upload Excel file
2. Select worksheet and name column
3. Configure options (header row checkbox)
4. Preview name conversions
5. Download processed file with username column