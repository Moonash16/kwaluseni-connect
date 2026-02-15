import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Banknote, Smartphone, Wallet, CreditCard } from 'lucide-react';

interface PaySubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaid?: () => void;
}

const paymentMethods = [
  { value: 'bank_transfer', label: 'Bank Transfer', icon: Banknote, description: 'Direct bank deposit' },
  { value: 'ewallet', label: 'eWallet', icon: Wallet, description: 'FNB eWallet' },
  { value: 'unayo', label: 'Unayo', icon: CreditCard, description: 'Unayo mobile money' },
  { value: 'momo', label: 'MoMo', icon: Smartphone, description: 'MTN Mobile Money' },
];

export function PaySubscriptionDialog({ open, onOpenChange, onPaid }: PaySubscriptionDialogProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('500');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const handleSubmit = async () => {
    if (!user || !amount || !paymentMethod) return;
    setLoading(true);

    const { error } = await supabase.from('contributions').insert({
      member_id: user.id,
      amount: Number(amount),
      month: currentMonth,
      year: currentYear,
      paid: true,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({
        title: 'Payment recorded!',
        description: `E${Number(amount).toLocaleString()} via ${paymentMethods.find(m => m.value === paymentMethod)?.label}`,
      });
      onOpenChange(false);
      setAmount('500');
      setPaymentMethod('bank_transfer');
      onPaid?.();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pay Monthly Subscription</DialogTitle>
          <DialogDescription>{currentMonth} {currentYear} — E500 monthly contribution</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Amount (E)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
            />
          </div>

          <div className="space-y-3">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.value;
                return (
                  <label
                    key={method.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <RadioGroupItem value={method.value} className="sr-only" />
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-medium text-sm text-foreground">{method.label}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading || !amount}>
            {loading ? 'Processing...' : `Pay E${Number(amount || 0).toLocaleString()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
