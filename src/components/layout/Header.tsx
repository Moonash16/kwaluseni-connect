import { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NotificationsDropdown } from './NotificationsDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, first_name, surname, email')
        .or(`first_name.ilike.%${searchTerm}%,surname.ilike.%${searchTerm}%`)
        .limit(5);
      setSearchResults(data ?? []);
      setShowResults(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <header className="flex items-center justify-between px-8 py-5 bg-card border-b border-border">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="w-64 pl-9 bg-secondary/50 border-0 focus-visible:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
          />
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-card border border-border rounded-lg shadow-medium z-50 overflow-hidden">
              {searchResults.map((member) => (
                <button
                  key={member.id}
                  className="w-full text-left px-4 py-3 hover:bg-secondary/50 transition-colors flex items-center gap-3"
                  onClick={() => {
                    navigate('/members');
                    setShowResults(false);
                    setSearchTerm('');
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground text-xs font-medium">
                    {member.first_name?.[0]}{member.surname?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{member.first_name} {member.surname}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <NotificationsDropdown />

        {/* User Avatar */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-primary/10"
          onClick={() => navigate('/profile')}
        >
          <User className="w-5 h-5 text-primary" />
        </Button>
        {profile && (
          <span className="text-sm font-medium text-foreground hidden lg:block">
            {profile.first_name} {profile.surname}
          </span>
        )}
      </div>
    </header>
  );
}
