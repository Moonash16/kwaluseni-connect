import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, User, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

export default function Members() {
  const [members, setMembers] = useState<any[]>([]);
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    let query = supabase.from('profiles').select('*');
    if (riskFilter !== 'all') {
      query = query.eq('risk_level', riskFilter);
    }
    const { data } = await query.order('created_at', { ascending: false });
    setMembers(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, [riskFilter]);

  const riskVariant: Record<string, any> = {
    Low: 'riskLow' as const,
    Medium: 'riskMedium' as const,
    High: 'riskHigh' as const,
  };

  return (
    <MainLayout 
      title="Members" 
      subtitle="Manage your stockvel community"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="Low">Low Risk</SelectItem>
              <SelectItem value="Medium">Medium Risk</SelectItem>
              <SelectItem value="High">High Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-12">Loading members...</p>
      ) : members.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No members found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member.id} className="card-community p-5 hover-lift animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-semibold text-lg">
                    {member.first_name?.[0]}{member.surname?.[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {member.first_name} {member.surname}
                    </h3>
                    <Badge variant={riskVariant[member.risk_level] ?? 'secondary'} className="text-[10px]">
                      {member.risk_level} Risk
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
