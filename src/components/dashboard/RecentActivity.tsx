import { Wallet, HandCoins, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'contribution' | 'loan_request' | 'loan_approved' | 'loan_repayment' | 'warning';
  message: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'contribution',
    message: 'Andile Gwebu paid E500 contribution',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'loan_request',
    message: 'Mr Matsebula requested E2,000 loan',
    time: '5 hours ago',
  },
  {
    id: '3',
    type: 'loan_repayment',
    message: 'Munashe Matsanura made loan payment of E725',
    time: '1 day ago',
  },
  {
    id: '4',
    type: 'warning',
    message: 'Junior Masuku has outstanding contribution',
    time: '2 days ago',
  },
  {
    id: '5',
    type: 'loan_approved',
    message: 'Andile Gwebu loan approved for E3,000',
    time: '5 days ago',
  },
];

const activityIcons = {
  contribution: Wallet,
  loan_request: HandCoins,
  loan_approved: CheckCircle,
  loan_repayment: Wallet,
  warning: AlertCircle,
};

const activityColors = {
  contribution: 'bg-success-light text-success',
  loan_request: 'bg-primary-light text-primary',
  loan_approved: 'bg-success-light text-success',
  loan_repayment: 'bg-primary-light text-primary',
  warning: 'bg-warning-light text-warning',
};

export function RecentActivity() {
  return (
    <div className="card-community p-6 animate-fade-in">
      <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          return (
            <div 
              key={activity.id}
              className="flex items-start gap-3 animate-slide-in-right"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn(
                "p-2 rounded-lg flex-shrink-0",
                activityColors[activity.type]
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
