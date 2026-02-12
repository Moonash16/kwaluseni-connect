import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Wallet, HandCoins, Save } from 'lucide-react';

export default function Profile() {
  const { profile, isAdmin, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name);
      setSurname(profile.surname);
      setEmail(profile.email);
      fetchUserData();
    }
  }, [profile]);

  const fetchUserData = async () => {
    if (!profile) return;
    const [loansRes, contribRes] = await Promise.all([
      supabase.from('loans').select('*').eq('member_id', profile.id),
      supabase.from('contributions').select('*').eq('member_id', profile.id),
    ]);
    setLoans(loansRes.data ?? []);
    setContributions(contribRes.data ?? []);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ first_name: firstName, surname, email })
      .eq('id', profile.id);

    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated!' });
      await refreshProfile();
    }
    setSaving(false);
  };

  const totalContributions = contributions.filter((c: any) => c.paid).reduce((sum: number, c: any) => sum + Number(c.amount), 0);
  const outstandingLoans = loans.filter((l: any) => l.status === 'Active' || l.status === 'Overdue');

  return (
    <MainLayout title="Profile" subtitle="View and edit your information">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Edit Profile */}
        <Card className="card-community">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">
                  {firstName?.[0]}{surname?.[0]}
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">{firstName} {surname}</p>
                <Badge variant={isAdmin ? 'default' : 'secondary'}>
                  {isAdmin ? 'Admin' : 'Member'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Surname</Label>
              <Input value={surname} onChange={(e) => setSurname(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <div className="space-y-6">
          <Card className="card-community">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Contribution History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                E{totalContributions.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                {contributions.filter((c: any) => c.paid).length} payments made
              </p>
            </CardContent>
          </Card>

          <Card className="card-community">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HandCoins className="w-5 h-5 text-primary" />
                Outstanding Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              {outstandingLoans.length === 0 ? (
                <p className="text-muted-foreground">No outstanding loans</p>
              ) : (
                <div className="space-y-3">
                  {outstandingLoans.map((loan: any) => (
                    <div key={loan.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">E{Number(loan.amount).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{loan.interest_rate}% interest</p>
                      </div>
                      <Badge variant={loan.status === 'Overdue' ? 'riskHigh' : 'active'}>
                        {loan.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
