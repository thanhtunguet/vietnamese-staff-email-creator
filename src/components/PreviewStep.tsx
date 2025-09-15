import { DownloadOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { downloadWorkbook, processExcelFile, type EmailProcessingResult, type ProcessingConfig } from '../services/excelService';

const { Title, Text } = Typography;

interface PreviewStepProps {
  file: File;
  config: ProcessingConfig;
  processedData: EmailProcessingResult[];
  onProcessedDataChange: (data: EmailProcessingResult[]) => void;
  onPrevious: () => void;
  onReset: () => void;
  onError: (error: string) => void;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  file,
  config,
  processedData,
  onProcessedDataChange,
  onPrevious,
  onReset,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [processedWorkbook, setProcessedWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    processData();
  }, []);

  const processData = async () => {
    try {
      setLoading(true);
      const result = await processExcelFile(file, config);
      onProcessedDataChange(result.processedData);
      setProcessedWorkbook(result.newWorkbook);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to process data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!processedWorkbook) {
      onError('No processed data available for download');
      return;
    }

    try {
      setDownloading(true);
      const fileName = `processed_${file.name.replace(/\.[^/.]+$/, '')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      downloadWorkbook(processedWorkbook, fileName);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  const columns = [
    {
      title: 'Original Name',
      dataIndex: 'originalName',
      key: 'originalName',
      width: '40%',
      render: (text: string) => (
        <span className="font-medium">{text}</span>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: '25%',
      render: (text: string) => (
        <Tag color={text ? 'blue' : 'red'} className="font-mono">
          {text || 'ERROR'}
        </Tag>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '35%',
      render: (text: string, record: EmailProcessingResult) => {
        if (text) {
          return <span className="text-blue-600 font-mono">{text}</span>;
        }
        if (record.username) {
          return <span className="text-gray-400">{record.username}@[domain]</span>;
        }
        return <span className="text-gray-400">-</span>;
      },
    },
  ];

  const stats = {
    total: processedData.length,
    successful: processedData.filter(item => item.username).length,
    conflicts: processedData.filter(item => item.username && /\d+$/.test(item.username)).length,
    errors: processedData.filter(item => !item.username).length,
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      <div className="text-center">
        <Title level={3}>Preview & Download</Title>
        <Text type="secondary">
          Review the processed results and download the updated Excel file
        </Text>
      </div>

      {/* Statistics */}
      <Card>
        <Row gutter={16} className="text-center">
          <Col span={6}>
            <Statistic
              title="Total Names"
              value={stats.total}
              prefix={<EyeOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Successfully Processed"
              value={stats.successful}
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Conflicts Resolved"
              value={stats.conflicts}
              valueStyle={{ color: '#1677ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Errors"
              value={stats.errors}
              valueStyle={{ color: '#cf1322' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Preview Table */}
      <Card
        title="Processing Results"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={processData}
            loading={loading}
            size="large"
          >
            Reprocess
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={processedData.map((item, index) => ({ ...item, key: index }))}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} items`,
            size: 'default',
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size !== pageSize) {
                setPageSize(size);
              }
            },
            onShowSizeChange: (_, size) => {
              setCurrentPage(1); // Reset to first page when page size changes
              setPageSize(size);
            },
          }}
          scroll={{ y: 400 }}
          size="middle"
        />
      </Card>

      {/* Download Section */}
      <Card className="bg-green-50 border-green-200">
        <div className="text-center space-y-4">
          <Title level={4} className="text-green-800 mb-2">Ready to Download</Title>
          <Text className="text-green-700">
            The processed Excel file will include a new "Username" column 
            {config.domain ? ' and "Email" column ' : ' '}
            next to your original name column.
          </Text>
          
          <div className="mt-4">
            <Button
              type="primary"
              size="large"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              loading={downloading}
              disabled={!processedWorkbook || stats.total === 0}
            >
              Download Processed Excel File
            </Button>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Space size="large" className="mr-2">
          <Button onClick={onPrevious} size="large">
            Previous: Configure Settings
          </Button>
          <span className="mx-2"></span>
          <Button onClick={onReset} size="large">
            Start Over
          </Button>
        </Space>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            loading={downloading}
            disabled={!processedWorkbook}
          >
            Download File
          </Button>
        </Space>
      </div>

      {/* Help Text */}
      <Card size="small" className="bg-blue-50 border-blue-200">
        <div className="text-sm text-blue-800">
          <strong>What happens next:</strong>
          <ul className="mt-2 ml-4 list-disc">
            <li>The downloaded file contains all your original data</li>
            <li>A new "Username" column is added next to the name column</li>
            {config.domain && <li>A new "Email" column with full email addresses</li>}
            <li>Conflicts are resolved with numeric suffixes (e.g., tungpt1, tungpt2)</li>
            <li>You can use this file for bulk email account creation</li>
          </ul>
        </div>
      </Card>
    </Space>
  );
};

export default PreviewStep;
