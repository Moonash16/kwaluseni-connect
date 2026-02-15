import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { NewLoanDialog } from '@/components/loans/NewLoanDialog';
import { MemberLoanRequestDialog } from '@/components/loans/MemberLoanRequestDialog';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

export default function Loans() {
  const { isAdmin } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [showNewLoan, setShowNewLoan] = useState(false);
  const [showMemberRequest, setShowMemberRequest] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('loans')
      .select('*, profiles:member_id(first_name, surname)')
      .order('created_at', { ascending: false });
    setLoans(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const activeLoans = loans.filter((l) => l.status === 'Active');
  const pendingLoans = loans.filter((l) => l.status === 'Pending');
  const completedLoans = loans.filter((l) => l.status === 'Repaid');

  const statusVariant: Record<string, any> = {
    Pending: 'pending',
    Approved: 'success',
    Active: 'active',
    Repaid: 'success',
    Overdue: 'riskHigh',
  };

  const renderLoanCard = (loan: any) => {
    const memberName = loan.profiles
      ? `${loan.profiles.first_name} ${loan.profiles.surname}`
      : 'Unknown';

    return (
      <div key={loan.id} className="card-community p-5 hover-lift animate-fade-in">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">{memberName}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {format(new Date(loan.created_at), 'MMM d, yyyy')}
            </p>
          </div>
          <Badge variant={statusVariant[loan.status] ?? 'secondary'}>{loan.status}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Principal</p>
            <p className="font-semibold text-foreground">E{Number(loan.amount).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Interest</p>
            <p className="font-semibold text-foreground">{loan.interest_rate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total</p>
            <p className="font-semibold text-foreground">E{Number(loan.total_repayment).toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  };

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

      <Tabs defaultValue="active" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="active">Active ({activeLoans.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingLoans.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedLoans.length})</TabsTrigger>
          </TabsList>
          {isAdmin ? (
            <Button className="bg-primary hover:bg-primary-dark" onClick={() => setShowNewLoan(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Loan Request
            </Button>
          ) : (
            <Button className="bg-primary hover:bg-primary-dark" onClick={() => setShowMemberRequest(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Request a Loan
            </Button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading loans...</p>
        ) : (
          <>
            <TabsContent value="active">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeLoans.map(renderLoanCard)}
              </div>
              {activeLoans.length === 0 && <p className="text-center text-muted-foreground py-12">No active loans</p>}
            </TabsContent>
            <TabsContent value="pending">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingLoans.map(renderLoanCard)}
              </div>
              {pendingLoans.length === 0 && <p className="text-center text-muted-foreground py-12">No pending loan requests</p>}
            </TabsContent>
            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedLoans.map(renderLoanCard)}
              </div>
              {completedLoans.length === 0 && <p className="text-center text-muted-foreground py-12">No completed loans</p>}
            </TabsContent>
          </>
        )}
      </Tabs>

      <NewLoanDialog open={showNewLoan} onOpenChange={setShowNewLoan} onCreated={fetchLoans} />
      <MemberLoanRequestDialog open={showMemberRequest} onOpenChange={setShowMemberRequest} onCreated={fetchLoans} />
    </MainLayout>
  );
}
