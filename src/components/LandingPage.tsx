
import { Button } from '@/components/ui/button';
import { Shield, Zap, Target, Users } from 'lucide-react';

interface LandingPageProps {
  onBeginInvestigation: () => void;
}

const LandingPage = ({ onBeginInvestigation }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23334155%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col items-center text-center">
        {/* Header */}
        <div className="mb-8 md:mb-12 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-center mb-4 md:mb-6">
            <Shield className="w-12 h-12 md:w-16 md:h-16 text-green-400 mb-4 md:mb-0 md:mr-4 animate-pulse" />
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-wave bg-[length:200%_auto]">
              Alien Recon Lab
            </h1>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
            Discover, Investigate, and Reveal the Alien Infiltration in Earth's Digital Realm
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 max-w-6xl px-4">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-green-400/20 rounded-lg p-4 md:p-6 hover:border-green-400/40 transition-all duration-300 hover:scale-105">
            <Target className="w-10 h-10 md:w-12 md:h-12 text-green-400 mb-4 mx-auto" />
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Mission-Based CTF</h3>
            <p className="text-slate-400 text-sm md:text-base">Solve cybersecurity challenges through immersive alien-themed scenarios</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-400/20 rounded-lg p-4 md:p-6 hover:border-blue-400/40 transition-all duration-300 hover:scale-105">
            <Zap className="w-10 h-10 md:w-12 md:h-12 text-blue-400 mb-4 mx-auto" />
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Real-World Skills</h3>
            <p className="text-slate-400 text-sm md:text-base">Practice OSINT, forensics, network analysis, and threat detection</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/20 rounded-lg p-4 md:p-6 hover:border-purple-400/40 transition-all duration-300 hover:scale-105 md:col-span-2 lg:col-span-1">
            <Users className="w-10 h-10 md:w-12 md:h-12 text-purple-400 mb-4 mx-auto" />
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Progressive Learning</h3>
            <p className="text-slate-400 text-sm md:text-base">Advance from Rookie to Elite Agent through challenging modules</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={onBeginInvestigation}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg text-lg md:text-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
        >
          <Shield className="w-5 h-5 md:w-6 md:h-6 mr-2" />
          Begin Investigation
        </Button>

        {/* Status indicator */}
        <div className="mt-8 md:mt-12 flex items-center text-green-400 animate-pulse">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
          <span className="text-xs md:text-sm font-mono">SYSTEM ONLINE • READY FOR INVESTIGATION</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
