import { MainLayout } from '@/components/layout/MainLayout';
import { LoanCard } from '@/components/dashboard/LoanCard';
import { loans } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculateLoanInterest } from '@/types/stockvel';

export default function Loans() {
  const activeLoans = loans.filter(l => l.status === 'active');
  const pendingLoans = loans.filter(l => l.status === 'pending');
  const completedLoans = loans.filter(l => l.status === 'repaid');

  return (
    <MainLayout 
      title="Loans" 
      subtitle="Manage borrowing and repayments"
    >
      {/* Interest Rate Info */}
      <div className="card-community p-6 mb-8 animate-fade-in">
        <h3 className="font-semibold text-foreground mb-4">Staggered Interest Rates</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { range: 'Up to E1,000', rate: 5 },
            { range: 'E1,001 - E5,000', rate: 8 },
            { range: 'E5,001 - E10,000', rate: 12 },
            { range: 'E10,001 - E25,000', rate: 15 },
            { range: 'Above E25,000', rate: 18 },
          ].map((tier) => (
            <div key={tier.range} className="text-center p-3 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">{tier.range}</p>
              <p className="text-2xl font-bold text-primary">{tier.rate}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <Tabs defaultValue="active" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="active">Active ({activeLoans.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingLoans.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedLoans.length})</TabsTrigger>
            </TabsList>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              New Loan Request
            </Button>
          </div>

          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeLoans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>
            {activeLoans.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No active loans</p>
            )}
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingLoans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>
            {pendingLoans.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No pending loan requests</p>
            )}
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedLoans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>
            {completedLoans.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No completed loans</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
