
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock, Target, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StoryPageProps {
  onStartChallenge: () => void;
}

const StoryPage = ({ onStartChallenge }: StoryPageProps) => {
  const [showMission, setShowMission] = useState(false);
  const [typedText, setTypedText] = useState('');
  
  const storyText = "An unknown digital signal from deep space has begun infiltrating critical infrastructure. Quantum signatures indicate non-terrestrial origin. As a rookie agent in the Alien Recon Lab, your mission is to analyze captured transmissions and uncover the alien infiltration route before it spreads to global networks. Time is running out...";

  useEffect(() => {
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < storyText.length) {
        setTypedText(storyText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(timer);
        setTimeout(() => setShowMission(true), 1000);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Cyberpunk background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Animated glow effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-green-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            THREAT DETECTED
          </h1>
          <div className="flex items-center justify-center text-red-400 animate-pulse">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <span className="text-lg font-mono">PRIORITY ALPHA • IMMEDIATE ACTION REQUIRED</span>
          </div>
        </div>

        {/* Story Section */}
        <Card className="w-full max-w-4xl bg-slate-900/80 border-red-500/30 shadow-2xl shadow-red-500/10 mb-12">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
              <h2 className="text-2xl font-bold text-red-400 font-mono">MISSION BRIEFING</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed font-mono">
              {typedText}
              <span className="animate-pulse">|</span>
            </p>
          </CardContent>
        </Card>

        {/* Mission Details */}
        {showMission && (
          <Card className="w-full max-w-3xl bg-slate-800/80 border-green-400/30 shadow-2xl shadow-green-400/10 animate-fade-in">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-3xl font-bold text-green-400 mb-4 font-mono">RECON RUMBLE</h3>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-center">
                      <Target className="w-5 h-5 text-blue-400 mr-3" />
                      <span className="font-mono">Category: OSINT</span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 text-yellow-400 mr-3" />
                      <span className="font-mono">Difficulty: Beginner</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-purple-400 mr-3" />
                      <span className="font-mono">Estimated Time: 30 mins</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center items-center">
                  <Button 
                    onClick={onStartChallenge}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 border border-green-400/30"
                  >
                    <AlertTriangle className="w-6 h-6 mr-2 animate-pulse" />
                    Start Investigation
                  </Button>
                  <p className="text-sm text-gray-400 mt-4 font-mono text-center">
                    Accessing terminal...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StoryPage;
