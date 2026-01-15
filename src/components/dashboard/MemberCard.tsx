import { Member } from '@/types/stockvel';
import { Badge } from '@/components/ui/badge';
import { getTotalContributionsByMember, getPaidMonthsCount } from '@/data/mockData';
import { User, TrendingUp } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onClick?: () => void;
}

export function MemberCard({ member, onClick }: MemberCardProps) {
  const totalContributions = getTotalContributionsByMember(member.id);
  const paidMonths = getPaidMonthsCount(member.id);
  
  const riskVariant = {
    low: 'riskLow' as const,
    medium: 'riskMedium' as const,
    high: 'riskHigh' as const,
  };

  const riskLabels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
  };

  return (
    <div 
      className="card-community p-5 cursor-pointer hover-lift animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground font-semibold text-lg">
            {member.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
            <Badge variant={riskVariant[member.riskLevel]} className="text-[10px]">
              {riskLabels[member.riskLevel]}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground truncate">{member.email}</p>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-foreground">
                E{totalContributions.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {paidMonths}/12 months
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="contribution-bar">
          <div 
            className="contribution-bar-fill" 
            style={{ width: `${(paidMonths / 12) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
