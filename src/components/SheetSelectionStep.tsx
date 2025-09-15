import React, { useState, useEffect } from 'react';
import { Select, Button, Typography, Space, Checkbox, Card, Tag, Divider } from 'antd';
import { FileExcelOutlined, TableOutlined } from '@ant-design/icons';
import { getWorksheetInfo, getColumnInfo, type ProcessingConfig, type WorksheetInfo, type ColumnInfo } from '../services/excelService';
import { convertNameToUsername } from '../utils/vietnamese';
import * as XLSX from 'xlsx';

const { Option } = Select;
const { Title, Text } = Typography;

interface SheetSelectionStepProps {
  workbook: XLSX.WorkBook;
  config: Partial<ProcessingConfig>;
  onConfigChange: (config: Partial<ProcessingConfig>) => void;
  onNext: () => void;
  onPrevious: () => void;
  onError: (error: string) => void;
}

const SheetSelectionStep: React.FC<SheetSelectionStepProps> = ({
  workbook,
  config,
  onConfigChange,
  onNext,
  onPrevious,
  onError
}) => {
  const [worksheets, setWorksheets] = useState<WorksheetInfo[]>([]);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const worksheetInfo = getWorksheetInfo(workbook);
      setWorksheets(worksheetInfo);
      
      // Auto-select first worksheet if only one exists
      if (worksheetInfo.length === 1 && !config.sheetName) {
        const firstSheet = worksheetInfo[0];
        onConfigChange({ 
          ...config, 
          sheetName: firstSheet.name,
          hasHeader: true 
        });
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to analyze worksheets');
    }
  }, [workbook, config, onConfigChange, onError]);

  useEffect(() => {
    if (config.sheetName) {
      loadColumns(config.sheetName, config.hasHeader ?? true);
    }
  }, [config.sheetName, config.hasHeader]);

  const loadColumns = async (sheetName: string, hasHeader: boolean) => {
    try {
      setLoading(true);
      const columnInfo = getColumnInfo(workbook, sheetName, hasHeader);
      setColumns(columnInfo);
      
      // Auto-select column if there's a likely name column
      if (columnInfo.length > 0 && config.columnIndex === undefined) {
        const nameColumn = columnInfo.find(col => 
          col.header.toLowerCase().includes('name') ||
          col.header.toLowerCase().includes('tên') ||
          col.header.toLowerCase().includes('họ')
        );
        
        if (nameColumn) {
          onConfigChange({ ...config, columnIndex: nameColumn.index });
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to analyze columns');
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSheetChange = (sheetName: string) => {
    onConfigChange({ 
      ...config, 
      sheetName,
      columnIndex: undefined // Reset column selection
    });
  };

  const handleHeaderChange = (checked: boolean) => {
    onConfigChange({ 
      ...config, 
      hasHeader: checked,
      columnIndex: undefined // Reset column selection
    });
  };

  const handleColumnChange = (columnIndex: number) => {
    onConfigChange({ ...config, columnIndex });
  };

  const handleDomainChange = (domain: string) => {
    onConfigChange({ ...config, domain: domain || undefined });
  };

  const isConfigValid = () => {
    return config.sheetName && 
           config.columnIndex !== undefined && 
           config.hasHeader !== undefined;
  };

  const selectedColumn = columns.find(col => col.index === config.columnIndex);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Title level={3}>Configure Processing Settings</Title>
        <Text type="secondary">
          Select worksheet, column, and configure options
        </Text>
      </div>

      {/* Worksheet Selection */}
      <Card size="small">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FileExcelOutlined className="text-blue-500" />
            <Title level={5} className="mb-0">Select Worksheet</Title>
          </div>
          
          <Select
            value={config.sheetName}
            onChange={handleSheetChange}
            placeholder="Choose a worksheet"
            className="w-full"
            size="large"
          >
            {worksheets.map(sheet => (
              <Option key={sheet.name} value={sheet.name}>
                <div className="flex justify-between items-center">
                  <span>{sheet.name}</span>
                  <span className="text-xs text-gray-500">
                    {sheet.rowCount} rows × {sheet.columnCount} cols
                  </span>
                </div>
              </Option>
            ))}
          </Select>

          <Checkbox
            checked={config.hasHeader ?? true}
            onChange={(e) => handleHeaderChange(e.target.checked)}
          >
            First row contains headers
          </Checkbox>
        </div>
      </Card>

      {/* Column Selection */}
      {config.sheetName && (
        <Card size="small" loading={loading}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TableOutlined className="text-green-500" />
              <Title level={5} className="mb-0">Select Name Column</Title>
            </div>
            
            <Select
              value={config.columnIndex}
              onChange={handleColumnChange}
              placeholder="Choose the column containing staff names"
              className="w-full"
              size="large"
            >
              {columns.map(column => (
                <Option key={column.index} value={column.index}>
                  <div className="space-y-1">
                    <div className="font-medium">{column.header}</div>
                    <div className="text-xs text-gray-500">
                      Sample values: {column.sampleValues.slice(0, 3).join(', ')}
                      {column.sampleValues.length > 3 && '...'}
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </div>
        </Card>
      )}

      {/* Column Preview */}
      {selectedColumn && selectedColumn.sampleValues.length > 0 && (
        <Card size="small" className="bg-gray-50">
          <div className="space-y-3">
            <Title level={5} className="mb-0">Preview: {selectedColumn.header}</Title>
            <div className="space-y-2">
              {selectedColumn.sampleValues.slice(0, 5).map((value, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="font-medium">{value}</span>
                  <Tag color="blue" className="font-mono">
                    {convertNameToUsername(value) || '(error)'}
                  </Tag>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Optional Domain Setting */}
      <Card size="small">
        <div className="space-y-4">
          <Title level={5} className="mb-0">Email Domain (Optional)</Title>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="company.com"
              value={config.domain || ''}
              onChange={(e) => handleDomainChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Text type="secondary" className="text-xs">
              If provided, full email addresses will be generated (e.g., tungpt@company.com)
            </Text>
          </div>
        </div>
      </Card>

      <Divider />

      <div className="flex justify-between">
        <Button onClick={onPrevious} size="large">
          Previous: Upload File
        </Button>
        <Button 
          type="primary" 
          onClick={onNext}
          disabled={!isConfigValid()}
          size="large"
        >
          Next: Preview & Process
        </Button>
      </div>
    </div>
  );
};

export default SheetSelectionStep;