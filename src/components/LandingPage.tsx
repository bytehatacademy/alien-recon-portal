
import { Button } from '@/components/ui/button';
import { Shield, Zap, Target, Users } from 'lucide-react';

interface LandingPageProps {
  onBeginInvestigation: () => void;
}

const LandingPage = ({ onBeginInvestigation }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center text-center">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-green-400 mr-4 animate-pulse" />
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Alien Recon Lab
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover, Investigate, and Reveal the Alien Infiltration in Earth's Digital Realm
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-green-400/20 rounded-lg p-6 hover:border-green-400/40 transition-all duration-300 hover:scale-105">
            <Target className="w-12 h-12 text-green-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">Mission-Based CTF</h3>
            <p className="text-gray-400">Solve cybersecurity challenges through immersive alien-themed scenarios</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-400/20 rounded-lg p-6 hover:border-blue-400/40 transition-all duration-300 hover:scale-105">
            <Zap className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">Real-World Skills</h3>
            <p className="text-gray-400">Practice OSINT, forensics, network analysis, and threat detection</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/20 rounded-lg p-6 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
            <Users className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">Progressive Learning</h3>
            <p className="text-gray-400">Advance from Rookie to Elite Agent through challenging modules</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={onBeginInvestigation}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
        >
          <Shield className="w-6 h-6 mr-2" />
          Begin Investigation
        </Button>

        {/* Status indicator */}
        <div className="mt-12 flex items-center text-green-400 animate-pulse">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
          <span className="text-sm font-mono">SYSTEM ONLINE • READY FOR INVESTIGATION</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
