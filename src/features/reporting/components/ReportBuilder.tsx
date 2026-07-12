import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReportType, DateRange } from '../types/reporting.types';
import { FileText, Download, Printer } from 'lucide-react';
import { ExportService } from '../services/ExportService';

export function ReportBuilder({ onGenerate }: { onGenerate: (type: ReportType, range: DateRange) => void }) {
  const [type, setType] = useState<ReportType>('Fleet');
  const [range, setRange] = useState<DateRange>('ThisMonth');

  const types: ReportType[] = ['Fleet', 'Trips', 'Maintenance', 'Compliance', 'Executive'];
  const ranges: DateRange[] = ['Today', 'ThisWeek', 'ThisMonth', 'ThisYear'];

  return (
    <Card className="print:hidden">
      <CardHeader>
        <CardTitle className="text-lg">Report Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="space-y-3 flex-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Report Subject</label>
            <div className="flex flex-wrap gap-2">
              {types.map(t => (
                <Button 
                  key={t} 
                  variant={type === t ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setType(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3 flex-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date Range</label>
            <div className="flex flex-wrap gap-2">
              {ranges.map(r => (
                <Button 
                  key={r} 
                  variant={range === r ? 'secondary' : 'outline'} 
                  size="sm"
                  onClick={() => setRange(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-end gap-2">
            <Button className="w-full md:w-auto" onClick={() => onGenerate(type, range)}>
              <FileText className="mr-2 h-4 w-4" /> Generate
            </Button>
            <Button variant="outline" size="icon" title="Export CSV" onClick={() => ExportService.exportToCSV('report', [{ test: 'data' }])}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Print to PDF" onClick={() => ExportService.triggerPDFPrint()}>
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
