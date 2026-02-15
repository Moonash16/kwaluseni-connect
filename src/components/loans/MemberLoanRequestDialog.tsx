import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { calculateLoanDetails } from '@/types/stockvel';

interface MemberLoanRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export function MemberLoanRequestDialog({ open, onOpenChange, onCreated }: MemberLoanRequestDialogProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState('12');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loanPreview = amount ? calculateLoanDetails(Number(amount), Number(months)) : null;

  const handleSubmit = async () => {
    if (!user || !amount || !months) return;
    setLoading(true);

    const { error } = await supabase.from('loans').insert({
      member_id: user.id,
      amount: Number(amount),
      repayment_months: Number(months),
      status: 'Pending',
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Loan request submitted!', description: 'Your request is pending approval.' });
      onOpenChange(false);
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
          <DialogTitle>Request a Loan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Loan Amount (E)</Label>
            <Input
              type="number"
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Repayment Period</Label>
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

          {/* Staggered Interest Info */}
          <div className="bg-secondary/50 rounded-lg p-3">
            <h4 className="font-medium text-foreground text-xs mb-2">Staggered Interest Rates</h4>
            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span>Up to E1,000</span><span className="font-medium text-foreground">5%</span>
              <span>E1,001 – E5,000</span><span className="font-medium text-foreground">8%</span>
              <span>E5,001 – E10,000</span><span className="font-medium text-foreground">12%</span>
              <span>E10,001 – E25,000</span><span className="font-medium text-foreground">15%</span>
              <span>Above E25,000</span><span className="font-medium text-foreground">18%</span>
            </div>
          </div>

          {loanPreview && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-foreground text-sm">Your Loan Summary</h4>
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
          <Button onClick={handleSubmit} disabled={loading || !amount}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
