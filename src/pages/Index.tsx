
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LandingPage from '../components/LandingPage';
import AuthModal from '../components/AuthModal';
import Dashboard from '../components/Dashboard';
import MissionDetail from '../components/MissionDetail';
import ProfileDashboard from '../components/ProfileDashboard';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentView, setCurrentView] = useState('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDashboard, setShowProfileDashboard] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);

  const handleBeginInvestigation = () => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setCurrentView('dashboard');
  };

  const handleMissionSelect = (mission) => {
    setSelectedMission(mission);
    setCurrentView('mission');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedMission(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onBeginInvestigation={handleBeginInvestigation} />;
      case 'dashboard':
        return (
          <Dashboard 
            user={user}
            onMissionSelect={handleMissionSelect}
          />
        );
      case 'mission':
        return (
          <MissionDetail 
            mission={selectedMission}
            onBack={handleBackToDashboard}
            user={user}
          />
        );
      default:
        return <LandingPage onBeginInvestigation={handleBeginInvestigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Profile Icon - Properly Sticky to Viewport */}
      {isAuthenticated && currentView !== 'landing' && (
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

      {renderCurrentView()}
      
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      <ProfileDashboard
        user={user}
        isOpen={showProfileDashboard}
        onClose={() => setShowProfileDashboard(false)}
        onLogout={logout}
      />
    </div>
  );
};

export default Index;
