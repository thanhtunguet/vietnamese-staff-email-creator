import React, { useState } from 'react';
import { Upload, Button, Typography, Space } from 'antd';
import { InboxOutlined, FileExcelOutlined } from '@ant-design/icons';
import { readExcelFile } from '../services/excelService';
import * as XLSX from 'xlsx';

const { Dragger } = Upload;
const { Title, Text } = Typography;

interface FileUploadStepProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onWorkbookLoaded: (workbook: XLSX.WorkBook) => void;
  onNext: () => void;
  onError: (error: string) => void;
}

const FileUploadStep: React.FC<FileUploadStepProps> = ({
  file,
  onFileChange,
  onWorkbookLoaded,
  onNext,
  onError
}) => {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (uploadFile: File) => {
    try {
      setLoading(true);
      onError(''); // Clear any previous errors
      
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'application/x-excel',
        'application/excel'
      ];
      
      if (!validTypes.includes(uploadFile.type) && 
          !uploadFile.name.toLowerCase().endsWith('.xlsx') && 
          !uploadFile.name.toLowerCase().endsWith('.xls')) {
        throw new Error('Please upload a valid Excel file (.xlsx or .xls)');
      }
      
      // Read the Excel file
      const workbook = await readExcelFile(uploadFile);
      
      // Check if workbook has any sheets
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('The Excel file does not contain any worksheets');
      }
      
      onFileChange(uploadFile);
      onWorkbookLoaded(workbook);
      
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to read Excel file');
      onFileChange(null);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx,.xls',
    beforeUpload: (uploadFile: File) => {
      handleFileUpload(uploadFile);
      return false; // Prevent automatic upload
    },
    onRemove: () => {
      onFileChange(null);
    },
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Title level={3}>Upload Excel File</Title>
        <Text type="secondary">
          Select an Excel file (.xlsx or .xls) containing Vietnamese staff names
        </Text>
      </div>

      <Dragger 
        {...uploadProps} 
        className="mb-6"
        disabled={loading}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined className="text-4xl text-blue-500" />
        </p>
        <p className="ant-upload-text text-lg">
          Click or drag Excel file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for single Excel file upload. Only .xlsx and .xls files are supported.
        </p>
      </Dragger>

      {file && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <FileExcelOutlined className="text-2xl text-green-600" />
            <div>
              <div className="font-medium text-green-800">{file.name}</div>
              <div className="text-sm text-green-600">
                Size: {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <div />
        <Space>
          <Button 
            type="primary" 
            onClick={onNext}
            disabled={!file || loading}
            loading={loading}
            size="large"
          >
            Next: Configure Settings
          </Button>
        </Space>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Title level={5} className="text-blue-800 mb-2">Sample File Format</Title>
        <div className="text-sm text-blue-700">
          <p>Your Excel file should have a column containing Vietnamese staff names:</p>
          <div className="mt-2 bg-white border rounded p-2 font-mono text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Column A: Staff Names</strong>
                <br />Pham Thanh Tung
                <br />Tran Thanh Thao  
                <br />Le Minh Thanh
                <br />Nguyen Van An
              </div>
              <div>
                <strong>Will become:</strong>
                <br />tungpt
                <br />thaott
                <br />thanhlm
                <br />annv
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadStep;