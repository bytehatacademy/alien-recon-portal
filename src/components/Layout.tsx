import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import ProfileDashboard from '@/components/ProfileDashboard';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showProfileDashboard, setShowProfileDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Profile Icon - Fixed Position */}
      {isAuthenticated && (
        <div className="fixed top-4 md:top-6 right-4 md:right-6 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowProfileDashboard(true)}
            className="rounded-full bg-slate-800/90 border border-green-400/50 hover:border-green-400/80 hover:bg-slate-700/90 transition-all duration-300 w-10 h-10 md:w-12 md:h-12"
          >
            <Avatar className="w-6 h-6 md:w-8 md:h-8 border border-green-400">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-slate-700 text-green-400 font-bold text-xs">
                {user?.name?.slice(0, 2)?.toUpperCase() || 'AG'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      )}

      {children}

      <ProfileDashboard
        user={user}
        isOpen={showProfileDashboard}
        onClose={() => setShowProfileDashboard(false)}
        onLogout={logout}
      />
    </div>
  );
};

export default Layout;
