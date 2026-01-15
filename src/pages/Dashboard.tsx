import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { MemberCard } from '@/components/dashboard/MemberCard';
import { LoanCard } from '@/components/dashboard/LoanCard';
import { ContributionChart } from '@/components/dashboard/ContributionChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { members, loans, stockvelStats } from '@/data/mockData';
import { Users, Wallet, HandCoins, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'pending');

  return (
    <MainLayout 
      title="Dashboard" 
      subtitle="Welcome back! Here's your stockvel overview"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Savings"
          value={`E${stockvelStats.totalSavings.toLocaleString()}`}
          subtitle="Annual pool fund"
          icon={Wallet}
          variant="primary"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Total Members"
          value={stockvelStats.totalMembers.toString()}
          subtitle="Active participants"
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Active Loans"
          value={stockvelStats.activeLoans.toString()}
          subtitle={`E${stockvelStats.totalLoansValue.toLocaleString()} outstanding`}
          icon={HandCoins}
          variant="warning"
        />
        <StatCard
          title="This Month"
          value={`E${stockvelStats.collectedThisMonth.toLocaleString()}`}
          subtitle={`of E${stockvelStats.monthlyContributionTarget.toLocaleString()} target`}
          icon={TrendingUp}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contribution Chart */}
          <ContributionChart />

          {/* Members Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Members</h2>
              <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary">
                <Link to="/members">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.slice(0, 4).map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-8">
          {/* Active Loans */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Active Loans</h2>
              <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary">
                <Link to="/loans">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {activeLoans.slice(0, 2).map((loan) => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </MainLayout>
  );
}
