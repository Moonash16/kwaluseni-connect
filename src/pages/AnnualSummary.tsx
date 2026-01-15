import { MainLayout } from '@/components/layout/MainLayout';
import { members, contributions, stockvelStats } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Wallet, Gift } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function AnnualSummary() {
  const year = 2024;
  const monthlyContribution = 500;
  const totalMonths = 12;
  const expectedPerMember = monthlyContribution * totalMonths;
  const totalExpected = expectedPerMember * members.length;

  const memberSummaries = members.map(member => {
    const memberContributions = contributions.filter(c => c.memberId === member.id && c.isPaid);
    const totalContributed = memberContributions.reduce((sum, c) => sum + c.amount, 0);
    const paidMonths = memberContributions.length;
    const percentage = (totalContributed / expectedPerMember) * 100;
    
    // Calculate payout share based on contributions
    const payoutShare = (totalContributed / stockvelStats.totalSavings) * stockvelStats.totalSavings;

    return {
      ...member,
      totalContributed,
      paidMonths,
      percentage,
      payoutShare,
    };
  });

  const pieData = memberSummaries.map(m => ({
    name: m.name.split(' ')[0],
    value: m.totalContributed,
  }));

  const barData = memberSummaries.map(m => ({
    name: m.name.split(' ')[0],
    contributed: m.totalContributed,
    expected: expectedPerMember,
  }));

  const COLORS = ['hsl(200, 85%, 50%)', 'hsl(145, 65%, 42%)', 'hsl(38, 95%, 50%)', 'hsl(280, 65%, 55%)'];

  return (
    <MainLayout 
      title="Annual Summary" 
      subtitle={`${year} Stockvel Performance & Payouts`}
    >
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card-community p-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary-light">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold text-foreground">E{stockvelStats.totalSavings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card-community p-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success-light">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Collection Rate</p>
              <p className="text-2xl font-bold text-foreground">{((stockvelStats.totalSavings / totalExpected) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="card-community p-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning-light">
              <Calendar className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expected Total</p>
              <p className="text-2xl font-bold text-foreground">E{totalExpected.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card-community p-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent">
              <Gift className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year-End Payout Pool</p>
              <p className="text-2xl font-bold text-foreground">E{(stockvelStats.totalSavings - stockvelStats.totalLoansValue).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Contribution Distribution */}
        <div className="card-community p-6 animate-fade-in">
          <h3 className="font-semibold text-foreground mb-6">Contribution Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `E${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contribution vs Expected */}
        <div className="card-community p-6 animate-fade-in">
          <h3 className="font-semibold text-foreground mb-6">Contributed vs Expected</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" />
                <XAxis type="number" tickFormatter={(v) => `E${v / 1000}k`} />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip formatter={(value: number) => `E${value.toLocaleString()}`} />
                <Bar dataKey="contributed" fill="hsl(200, 85%, 50%)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="expected" fill="hsl(210, 15%, 85%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Member Payout Summary */}
      <div className="card-community overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">Individual Member Summary</h3>
          <p className="text-sm text-muted-foreground mt-1">Contributions and estimated year-end payout</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-left py-3 px-6 font-medium text-muted-foreground text-sm">Member</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">Months Paid</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">Contributed</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">Expected</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">Completion</th>
                <th className="text-right py-3 px-6 font-medium text-muted-foreground text-sm">Est. Payout</th>
              </tr>
            </thead>
            <tbody>
              {memberSummaries.map((member) => (
                <tr key={member.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground text-sm font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="font-medium text-foreground">{member.paidMonths}</span>
                    <span className="text-muted-foreground">/{totalMonths}</span>
                  </td>
                  <td className="text-right py-4 px-4 font-medium text-foreground">
                    E{member.totalContributed.toLocaleString()}
                  </td>
                  <td className="text-right py-4 px-4 text-muted-foreground">
                    E{expectedPerMember.toLocaleString()}
                  </td>
                  <td className="text-center py-4 px-4">
                    <Badge variant={member.percentage >= 90 ? 'success' : member.percentage >= 70 ? 'warning' : 'riskHigh'}>
                      {member.percentage.toFixed(0)}%
                    </Badge>
                  </td>
                  <td className="text-right py-4 px-6">
                    <span className="font-semibold text-primary">E{member.payoutShare.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-secondary/50 border-t border-border">
                <td className="py-4 px-6 font-semibold text-foreground">Total</td>
                <td></td>
                <td className="text-right py-4 px-4 font-bold text-foreground">
                  E{stockvelStats.totalSavings.toLocaleString()}
                </td>
                <td className="text-right py-4 px-4 font-medium text-muted-foreground">
                  E{totalExpected.toLocaleString()}
                </td>
                <td></td>
                <td className="text-right py-4 px-6 font-bold text-primary">
                  E{stockvelStats.totalSavings.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
