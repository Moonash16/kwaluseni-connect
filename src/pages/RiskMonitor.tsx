import { MainLayout } from '@/components/layout/MainLayout';
import { members, loans, contributions } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, Clock, CreditCard } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface RiskFactor {
  type: 'late_payments' | 'missed_contributions' | 'multiple_loans' | 'overdue';
  label: string;
  severity: 'low' | 'medium' | 'high';
}

function getMemberRiskFactors(memberId: string): RiskFactor[] {
  const factors: RiskFactor[] = [];
  
  const memberContributions = contributions.filter(c => c.memberId === memberId);
  const missedContributions = memberContributions.filter(c => !c.isPaid).length;
  
  const memberLoans = loans.filter(l => l.memberId === memberId);
  const activeLoans = memberLoans.filter(l => l.status === 'active').length;
  const overdueLoans = memberLoans.filter(l => l.status === 'overdue').length;

  if (missedContributions >= 3) {
    factors.push({
      type: 'missed_contributions',
      label: `${missedContributions} missed contributions`,
      severity: missedContributions >= 4 ? 'high' : 'medium',
    });
  }

  if (activeLoans >= 2) {
    factors.push({
      type: 'multiple_loans',
      label: `${activeLoans} active loans`,
      severity: 'medium',
    });
  }

  if (overdueLoans > 0) {
    factors.push({
      type: 'overdue',
      label: `${overdueLoans} overdue loan(s)`,
      severity: 'high',
    });
  }

  return factors;
}

export default function RiskMonitor() {
  const membersWithRisk = members.map(member => ({
    ...member,
    riskFactors: getMemberRiskFactors(member.id),
  }));

  const highRiskMembers = membersWithRisk.filter(m => m.riskLevel === 'high');
  const mediumRiskMembers = membersWithRisk.filter(m => m.riskLevel === 'medium');
  const lowRiskMembers = membersWithRisk.filter(m => m.riskLevel === 'low');

  const riskDistribution = {
    low: (lowRiskMembers.length / members.length) * 100,
    medium: (mediumRiskMembers.length / members.length) * 100,
    high: (highRiskMembers.length / members.length) * 100,
  };

  return (
    <MainLayout 
      title="Risk Monitor" 
      subtitle="Track and manage borrower risk levels"
    >
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-community p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-success-light">
              <TrendingDown className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Risk</p>
              <p className="text-2xl font-bold text-foreground">{lowRiskMembers.length}</p>
            </div>
          </div>
          <Progress value={riskDistribution.low} className="h-2 bg-secondary" />
        </div>

        <div className="card-community p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-warning-light">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Medium Risk</p>
              <p className="text-2xl font-bold text-foreground">{mediumRiskMembers.length}</p>
            </div>
          </div>
          <Progress value={riskDistribution.medium} className="h-2 bg-secondary [&>div]:bg-warning" />
        </div>

        <div className="card-community p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-destructive-light">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">High Risk</p>
              <p className="text-2xl font-bold text-foreground">{highRiskMembers.length}</p>
            </div>
          </div>
          <Progress value={riskDistribution.high} className="h-2 bg-secondary [&>div]:bg-destructive" />
        </div>
      </div>

      {/* Risk Member List */}
      <div className="card-community overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">Member Risk Assessment</h3>
          <p className="text-sm text-muted-foreground mt-1">Based on payment history and loan activity</p>
        </div>

        <div className="divide-y divide-border">
          {membersWithRisk.map((member) => {
            const riskVariant = {
              low: 'riskLow' as const,
              medium: 'riskMedium' as const,
              high: 'riskHigh' as const,
            };

            return (
              <div key={member.id} className="p-6 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground font-medium">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <Badge variant={riskVariant[member.riskLevel]} className="capitalize">
                    {member.riskLevel} Risk
                  </Badge>
                </div>

                {member.riskFactors.length > 0 && (
                  <div className="mt-4 pl-16">
                    <p className="text-sm text-muted-foreground mb-2">Risk Factors:</p>
                    <div className="flex flex-wrap gap-2">
                      {member.riskFactors.map((factor, index) => (
                        <Badge 
                          key={index} 
                          variant={factor.severity === 'high' ? 'riskHigh' : factor.severity === 'medium' ? 'riskMedium' : 'riskLow'}
                          className="text-xs"
                        >
                          {factor.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {member.riskFactors.length === 0 && (
                  <div className="mt-4 pl-16">
                    <p className="text-sm text-success flex items-center gap-1">
                      <TrendingDown className="w-4 h-4" />
                      Excellent payment history
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
