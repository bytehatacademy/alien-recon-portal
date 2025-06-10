import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import LandingPage from '../components/LandingPage';
import AuthModal from '../components/AuthModal';
import Dashboard from '../components/Dashboard';
import MissionDetail from '../components/MissionDetail';
import ProfileDashboard from '../components/ProfileDashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDashboard, setShowProfileDashboard] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [user, setUser] = useState(null);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);

  const handleAuthSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setShowAuthModal(false);
    setCurrentView('dashboard');
  };

  const handleBeginInvestigation = () => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleMissionSelect = (mission) => {
    setSelectedMission(mission);
    setCurrentView('mission');
  };

  const handleBackToDashboard = () => {
    // When coming back from a completed mission, add it to completed missions
    if (selectedMission) {
      setCompletedMissions(prev => {
        if (!prev.includes(selectedMission.id)) {
          return [...prev, selectedMission.id];
        }
        return prev;
      });
    }
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
            completedMissions={completedMissions}
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
      {/* Profile Icon - Fixed Sticky Position */}
      {isAuthenticated && currentView !== 'landing' && (
        <div className="fixed top-6 right-6 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowProfileDashboard(true)}
            className="rounded-full bg-slate-800/90 border border-green-400/50 hover:border-green-400/80 hover:bg-slate-700/90 transition-all duration-300"
          >
            <Avatar className="w-8 h-8 border border-green-400">
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
      />
    </div>
  );
};

export default Index;
