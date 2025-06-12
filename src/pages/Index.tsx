import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import AuthModal from '../components/AuthModal';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleBeginInvestigation = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background relative">
      <LandingPage onBeginInvestigation={handleBeginInvestigation} />
      
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
