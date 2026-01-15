import { MainLayout } from '@/components/layout/MainLayout';
import { MemberCard } from '@/components/dashboard/MemberCard';
import { members } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';

export default function Members() {
  return (
    <MainLayout 
      title="Members" 
      subtitle="Manage your stockvel community"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button className="bg-primary hover:bg-primary-dark">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </MainLayout>
  );
}
