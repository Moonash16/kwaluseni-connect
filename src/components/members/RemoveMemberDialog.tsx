import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RemoveMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: { id: string; first_name: string; surname: string } | null;
  onRemoved?: () => void;
}

export function RemoveMemberDialog({ open, onOpenChange, member, onRemoved }: RemoveMemberDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRemove = async () => {
    if (!member) return;
    setLoading(true);

    // Delete related data first, then profile
    await supabase.from('repayments').delete().in(
      'loan_id',
      (await supabase.from('loans').select('id').eq('member_id', member.id)).data?.map(l => l.id) ?? []
    );
    await supabase.from('loans').delete().eq('member_id', member.id);
    await supabase.from('contributions').delete().eq('member_id', member.id);
    await supabase.from('notifications').delete().eq('member_id', member.id);
    await supabase.from('user_roles').delete().eq('user_id', member.id);
    const { error } = await supabase.from('profiles').delete().eq('id', member.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Member removed', description: `${member.first_name} ${member.surname} has been removed.` });
      onOpenChange(false);
      onRemoved?.();
    }
    setLoading(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to remove this member?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{member?.first_name} {member?.surname}</strong> and all their contributions, loans, and repayments. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemove} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {loading ? 'Removing...' : 'Remove Member'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
