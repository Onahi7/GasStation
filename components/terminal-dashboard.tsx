'use client';

import { useState, useEffect } from 'react';
import { useTerminal } from '@/contexts/terminal-context';
import { getTerminalSummaryMetrics } from '@/app/actions/terminals';
import { StatCard } from '@/components/stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropletIcon, 
  GaugeIcon, 
  TruckIcon, 
  DollarSignIcon,
  CreditCardIcon, 
  ReceiptIcon
} from 'lucide-react';

export function TerminalDashboard() {
  const { currentTerminalId, currentTerminal } = useTerminal();
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (currentTerminalId) {
      setIsLoading(true);
      getTerminalSummaryMetrics(currentTerminalId, period)
        .then(setMetrics)
        .finally(() => setIsLoading(false));
    }
  }, [currentTerminalId, period]);
  
  if (!currentTerminalId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No terminal selected</p>
            {currentTerminal === undefined && !isLoading && (
              <p className="text-xs text-muted-foreground mt-2">
                Please select a terminal from the dropdown above or ask your administrator to assign you to a terminal
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isLoading && !metrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Loading terminal data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {currentTerminal?.name || 'Terminal Dashboard'}
        </h2>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as 'day' | 'week' | 'month')}>
          <TabsList>
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Total Sales" 
            value={`$${metrics.totalSales.toFixed(2)}`}
            icon={<DollarSignIcon className="h-4 w-4" />}
            description={`${metrics.cashCount + metrics.electronicCount} transactions`}
          />
          <StatCard 
            title="Cash Sales" 
            value={`$${metrics.cashSales.toFixed(2)}`}
            icon={<ReceiptIcon className="h-4 w-4" />}
            description={`${metrics.cashCount} transactions`}
          />
          <StatCard 
            title="Electronic Payments" 
            value={`$${metrics.electronicSales.toFixed(2)}`}
            icon={<CreditCardIcon className="h-4 w-4" />}
            description={`${metrics.electronicCount} transactions`}
          />
          <StatCard 
            title="Expenses" 
            value={`$${metrics.expenses.toFixed(2)}`}
            icon={<DollarSignIcon className="h-4 w-4" />}
            description={`${metrics.expenseCount} expense records`}
          />
          <StatCard 
            title="Shifts Completed" 
            value={metrics.shifts.toString()}
            icon={<GaugeIcon className="h-4 w-4" />}
          />
          <StatCard 
            title="Net Revenue" 
            value={`$${(metrics.totalSales - metrics.expenses).toFixed(2)}`}
            icon={<DollarSignIcon className="h-4 w-4" />}
            description="Sales minus expenses"
          />
        </div>
      )}
      
      {currentTerminal && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DropletIcon className="h-5 w-5" />
                Tanks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTerminal.tanks && currentTerminal.tanks.length > 0 ? (
                <div className="space-y-2">
                  {currentTerminal.tanks.map((tank: any) => (
                    <div key={tank.id} className="flex justify-between items-center">
                      <span>Tank #{tank.number}</span>
                      <span>Capacity: {tank.capacity} liters</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tanks configured for this terminal</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GaugeIcon className="h-5 w-5" />
                Pumps
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTerminal.pumps && currentTerminal.pumps.length > 0 ? (
                <div className="space-y-2">
                  {currentTerminal.pumps.map((pump: any) => (
                    <div key={pump.id} className="flex justify-between items-center">
                      <span>Pump #{pump.number}</span>
                      <span>{pump._count.meterReadings} readings</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No pumps configured for this terminal</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
