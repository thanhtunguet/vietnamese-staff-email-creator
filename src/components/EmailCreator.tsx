import React, { useState } from 'react';
import { Steps, Card, Alert } from 'antd';
import FileUploadStep from './FileUploadStep';
import SheetSelectionStep from './SheetSelectionStep';
import PreviewStep from './PreviewStep';
import type { ProcessingConfig, EmailProcessingResult } from '../services/excelService';
import * as XLSX from 'xlsx';

interface EmailCreatorState {
  currentStep: number;
  file: File | null;
  workbook: XLSX.WorkBook | null;
  config: Partial<ProcessingConfig>;
  processedData: EmailProcessingResult[];
  error: string | null;
}

const EmailCreator: React.FC = () => {
  const [state, setState] = useState<EmailCreatorState>({
    currentStep: 0,
    file: null,
    workbook: null,
    config: {},
    processedData: [],
    error: null
  });

  const updateState = (updates: Partial<EmailCreatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    updateState({ currentStep: state.currentStep + 1 });
  };

  const handlePrevious = () => {
    updateState({ currentStep: state.currentStep - 1 });
  };

  const handleReset = () => {
    setState({
      currentStep: 0,
      file: null,
      workbook: null,
      config: {},
      processedData: [],
      error: null
    });
  };

  const steps = [
    {
      title: 'Upload File',
      description: 'Select Excel file containing staff names',
    },
    {
      title: 'Configure',
      description: 'Choose worksheet and column settings',
    },
    {
      title: 'Preview & Download',
      description: 'Review results and download processed file',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <Steps 
          current={state.currentStep} 
          className="mb-8"
          items={steps}
        />

        {state.error && (
          <Alert
            message="Error"
            description={state.error}
            type="error"
            className="mb-6"
            closable
            onClose={() => updateState({ error: null })}
          />
        )}

        {state.currentStep === 0 && (
          <FileUploadStep
            file={state.file}
            onFileChange={(file) => updateState({ file })}
            onWorkbookLoaded={(workbook) => updateState({ workbook })}
            onNext={handleNext}
            onError={(error) => updateState({ error })}
          />
        )}

        {state.currentStep === 1 && state.workbook && (
          <SheetSelectionStep
            workbook={state.workbook}
            config={state.config}
            onConfigChange={(config) => updateState({ config })}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onError={(error) => updateState({ error })}
          />
        )}

        {state.currentStep === 2 && state.file && state.workbook && (
          <PreviewStep
            file={state.file}
            workbook={state.workbook}
            config={state.config as ProcessingConfig}
            processedData={state.processedData}
            onProcessedDataChange={(data) => updateState({ processedData: data })}
            onPrevious={handlePrevious}
            onReset={handleReset}
            onError={(error) => updateState({ error })}
          />
        )}
      </Card>

      <Card size="small" className="bg-blue-50 border-blue-200">
        <div className="text-sm text-blue-800">
          <strong>How it works:</strong>
          <ul className="mt-2 ml-4 list-disc">
            <li>Upload Excel file containing Vietnamese staff names</li>
            <li>Select worksheet and column containing names</li>
            <li>Names are converted to email format: PrimaryName + Initials</li>
            <li>Conflicts are resolved with numeric suffixes</li>
            <li>Download processed file with username column added</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default EmailCreator;