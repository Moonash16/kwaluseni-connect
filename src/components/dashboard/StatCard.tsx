import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  trend,
  variant = 'default'
}: StatCardProps) {
  const iconBgColors = {
    default: 'bg-secondary',
    primary: 'bg-primary/10',
    success: 'bg-success-light',
    warning: 'bg-warning-light',
  };

  const iconColors = {
    default: 'text-foreground',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
  };

  return (
    <div className="stat-card animate-fade-in hover-lift">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground animate-count-up">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              "text-sm font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          iconBgColors[variant]
        )}>
          <Icon className={cn("w-6 h-6", iconColors[variant])} />
        </div>
      </div>
    </div>
  );
}
