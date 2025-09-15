import React, { useState, useEffect } from 'react';
import { Select, Button, Typography, Checkbox, Card, Tag, Divider, Input, Form, Space } from 'antd';
import { FileExcelOutlined, TableOutlined } from '@ant-design/icons';
import { getWorksheetInfo, getColumnHeaders, type ProcessingConfig, type WorksheetInfo, type ColumnInfo } from '../services/excelService';
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
      // Lightweight: read only headers to avoid loading all rows
      const columnInfo = getColumnHeaders(workbook, sheetName, hasHeader);
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
      hasHeader: config.hasHeader ?? true,
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
    return Boolean(config.sheetName) && config.columnIndex !== undefined;
  };

  const selectedColumn = columns.find(col => col.index === config.columnIndex);

  return (
    <Space direction="vertical" size="large" className="w-full">
      <div className="text-center">
        <Title level={3}>Configure Processing Settings</Title>
        <Text type="secondary">
          Select worksheet, column, and configure options
        </Text>
      </div>

      {/* Worksheet Selection */}
      <Card size="small">
        <Form layout="vertical">
          <Form.Item label={
            <div className="flex items-center space-x-2">
              <FileExcelOutlined className="text-blue-500" />
              <span className="ant-typography ant-typography-strong">Select Worksheet</span>
            </div>
          }>
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
          </Form.Item>

          <Form.Item>
            <Checkbox
              checked={config.hasHeader ?? true}
              onChange={(e) => handleHeaderChange(e.target.checked)}
            >
              First row contains headers
            </Checkbox>
          </Form.Item>
        </Form>
      </Card>

      {/* Column Selection */}
      {config.sheetName && (
        <Card size="small" loading={loading}>
          <Form layout="vertical">
            <Form.Item label={
              <div className="flex items-center space-x-2">
                <TableOutlined className="text-green-500" />
                <span className="ant-typography ant-typography-strong">Select Name Column</span>
              </div>
            }>
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
                      {column.sampleValues.length > 0 && (
                        <div className="text-xs text-gray-500">
                          Sample values: {column.sampleValues.slice(0, 3).join(', ')}
                          {column.sampleValues.length > 3 && '...'}
                        </div>
                      )}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
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
        <Form layout="vertical">
          <Form.Item label="Email Domain (Optional)">
            <Input
              placeholder="company.com"
              value={config.domain || ''}
              onChange={(e) => handleDomainChange(e.target.value)}
              size="large"
              allowClear
            />
          </Form.Item>
          <Text type="secondary" className="text-xs">
            If provided, full email addresses will be generated (e.g., tungpt@company.com)
          </Text>
        </Form>
      </Card>

      <Divider />

      <div className="flex justify-between">
        <Space size="large">
          <Button onClick={onPrevious} size="large">
            Previous: Upload File
          </Button>
        </Space>
        <Space size="large">
          <Button 
            type="primary" 
            onClick={onNext}
            disabled={!isConfigValid()}
            size="large"
          >
            Next: Preview & Process
          </Button>
        </Space>
      </div>
    </Space>
  );
};

export default SheetSelectionStep;
