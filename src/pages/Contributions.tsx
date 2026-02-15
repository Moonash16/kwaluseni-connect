import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ContributionChart } from '@/components/dashboard/ContributionChart';
import { members, contributions } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Calendar, CreditCard } from 'lucide-react';
import { PaySubscriptionDialog } from '@/components/contributions/PaySubscriptionDialog';

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function Contributions() {
  const [showPay, setShowPay] = useState(false);

  return (
    <MainLayout 
      title="Contributions" 
      subtitle="Track monthly payments and outstanding balances"
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <ContributionChart />
        </div>

        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary-dark" onClick={() => setShowPay(true)}>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Subscription
          </Button>
        </div>

        {/* Contribution Matrix */}
        <div className="card-community overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold text-foreground">2024 Contribution Status</h3>
            <p className="text-sm text-muted-foreground mt-1">Monthly E500 contribution per member</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm sticky left-0 bg-secondary/50">
                    Member
                  </th>
                  {months.map((month) => (
                    <th key={month} className="text-center py-3 px-3 font-medium text-muted-foreground text-sm min-w-[60px]">
                      {month}
                    </th>
                  ))}
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const memberContributions = contributions.filter(c => c.memberId === member.id);
                  const totalPaid = memberContributions.filter(c => c.isPaid).reduce((sum, c) => sum + c.amount, 0);
                  
                  return (
                    <tr key={member.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                      <td className="py-4 px-4 sticky left-0 bg-card">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground text-xs font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium text-foreground">{member.name}</span>
                        </div>
                      </td>
                      {months.map((month, index) => {
                        const contribution = memberContributions[index];
                        const isPaid = contribution?.isPaid;
                        
                        return (
                          <td key={month} className="text-center py-4 px-3">
                            {isPaid ? (
                              <div className="w-6 h-6 rounded-full bg-success-light flex items-center justify-center mx-auto">
                                <Check className="w-3.5 h-3.5 text-success" />
                              </div>
                            ) : index < 11 ? (
                              <div className="w-6 h-6 rounded-full bg-destructive-light flex items-center justify-center mx-auto">
                                <X className="w-3.5 h-3.5 text-destructive" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center mx-auto">
                                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="text-right py-4 px-4">
                        <Badge variant={totalPaid >= 5500 ? 'success' : 'warning'}>
                          E{totalPaid.toLocaleString()}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PaySubscriptionDialog open={showPay} onOpenChange={setShowPay} />
    </MainLayout>
  );
}
