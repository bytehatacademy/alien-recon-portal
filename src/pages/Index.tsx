
import { useState } from 'react';
import LandingPage from '../components/LandingPage';
import AuthModal from '../components/AuthModal';
import Dashboard from '../components/Dashboard';
import MissionDetail from '../components/MissionDetail';

const Index = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [user, setUser] = useState(null);

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
    <div className="min-h-screen bg-background">
      {renderCurrentView()}
      
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default Index;
