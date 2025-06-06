
import { useState } from 'react';
import LandingPage from '../components/LandingPage';
import StoryPage from '../components/StoryPage';
import ChallengePage from '../components/ChallengePage';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'story' | 'challenge'>('landing');

  const handleBeginInvestigation = () => {
    setCurrentView('story');
  };

  const handleStartChallenge = () => {
    setCurrentView('challenge');
  };

  const handleBackToStory = () => {
    setCurrentView('story');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onBeginInvestigation={handleBeginInvestigation} />;
      case 'story':
        return <StoryPage onStartChallenge={handleStartChallenge} />;
      case 'challenge':
        return <ChallengePage onBack={handleBackToStory} />;
      default:
        return <LandingPage onBeginInvestigation={handleBeginInvestigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentView()}
    </div>
  );
};

export default Index;
