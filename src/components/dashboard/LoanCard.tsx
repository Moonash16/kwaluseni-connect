import { Loan } from '@/types/stockvel';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Percent, Wallet } from 'lucide-react';
import { format } from 'date-fns';

interface LoanCardProps {
  loan: Loan;
  onClick?: () => void;
}

export function LoanCard({ loan, onClick }: LoanCardProps) {
  const progressPercent = (loan.paidAmount / loan.totalRepayment) * 100;
  
  const statusConfig = {
    pending: { variant: 'pending' as const, label: 'Pending Approval' },
    approved: { variant: 'success' as const, label: 'Approved' },
    active: { variant: 'active' as const, label: 'Active' },
    repaid: { variant: 'success' as const, label: 'Fully Repaid' },
    overdue: { variant: 'riskHigh' as const, label: 'Overdue' },
  };

  const config = statusConfig[loan.status];

  return (
    <div 
      className="card-community p-5 cursor-pointer hover-lift animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{loan.memberName}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            {format(loan.requestDate, 'MMM d, yyyy')}
          </p>
        </div>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Principal</p>
          <p className="font-semibold text-foreground">E{loan.principalAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Interest</p>
          <p className="font-semibold text-foreground flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-primary" />
            {loan.interestRate}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Monthly</p>
          <p className="font-semibold text-foreground">E{loan.monthlyPayment.toFixed(0)}</p>
        </div>
      </div>

      {loan.status !== 'pending' && (
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Repayment Progress</span>
            <span className="font-medium text-foreground">
              E{loan.paidAmount.toLocaleString()} / E{loan.totalRepayment.toLocaleString()}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      )}
    </div>
  );
}
