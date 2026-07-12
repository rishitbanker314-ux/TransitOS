export type ReportType = 'Fleet' | 'Trips' | 'Maintenance' | 'Compliance' | 'Executive';
export type ExportFormat = 'PDF' | 'CSV' | 'JSON';
export type DateRange = 'Today' | 'ThisWeek' | 'ThisMonth' | 'ThisYear' | 'Custom';

export interface ReportConfig {
  id: string;
  name: string;
  type: ReportType;
  dateRange: DateRange;
  customStartDate?: string;
  customEndDate?: string;
  includeAIAnalysis: boolean;
}

export interface AIExecutiveSummary {
  reportId: string;
  generatedAt: string;
  summary: string;
  keyRisks: string[];
  recommendations: string[];
  confidenceScore: number; // 0.0 to 1.0
}

export interface MetricAggregation {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'neutral';
  percentageChange: number;
}
