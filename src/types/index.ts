export interface LabResult {
  id: string;
  testName: string;
  category: 'hematology' | 'chemistry' | 'immunology';
  value: number;
  unit: string;
  referenceRange: {
    low: number;
    high: number;
    criticalLow?: number;
    criticalHigh?: number;
  };
  timestamp: string;
  status: 'normal' | 'high' | 'low' | 'critical';
}

export interface TestCategory {
  id: string;
  name: string;
  description: string;
  tests: string[];
}
