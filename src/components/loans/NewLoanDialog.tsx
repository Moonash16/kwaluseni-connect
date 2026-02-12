import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateLoanDetails } from '@/types/stockvel';

interface NewLoanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export function NewLoanDialog({ open, onOpenChange, onCreated }: NewLoanDialogProps) {
  const [members, setMembers] = useState<any[]>([]);
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState('12');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      supabase.from('profiles').select('id, first_name, surname').then(({ data }) => {
        setMembers(data ?? []);
      });
    }
  }, [open]);

  const loanPreview = amount ? calculateLoanDetails(Number(amount), Number(months)) : null;

  const handleSubmit = async () => {
    if (!memberId || !amount || !months) return;
    setLoading(true);

    const { error } = await supabase.from('loans').insert({
      member_id: memberId,
      amount: Number(amount),
      repayment_months: Number(months),
      status: 'Pending',
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Loan request created!' });
      onOpenChange(false);
      setMemberId('');
      setAmount('');
      setMonths('12');
      onCreated?.();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Loan Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Member</Label>
            <Select value={memberId} onValueChange={setMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.first_name} {m.surname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Loan Amount (E)</Label>
            <Input
              type="number"
              placeholder="5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Repayment Period (months)</Label>
            <Select value={months} onValueChange={setMonths}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[3, 6, 9, 12, 18, 24].map((m) => (
                  <SelectItem key={m} value={m.toString()}>
                    {m} months
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loanPreview && (
            <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-foreground text-sm">Loan Preview</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Interest Rate:</span>
                <span className="font-medium text-foreground">{loanPreview.interestRate}%</span>
                <span className="text-muted-foreground">Interest Amount:</span>
                <span className="font-medium text-foreground">E{loanPreview.totalInterest.toLocaleString()}</span>
                <span className="text-muted-foreground">Total Repayment:</span>
                <span className="font-medium text-foreground">E{loanPreview.totalRepayment.toLocaleString()}</span>
                <span className="text-muted-foreground">Monthly Payment:</span>
                <span className="font-medium text-primary">E{loanPreview.monthlyPayment.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading || !memberId || !amount}>
            {loading ? 'Creating...' : 'Create Loan Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
