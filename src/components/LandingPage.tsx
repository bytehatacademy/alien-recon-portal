
import { Button } from '@/components/ui/button';
import { Shield, Zap } from 'lucide-react';

interface LandingPageProps {
  onBeginInvestigation: () => void;
}

const LandingPage = ({ onBeginInvestigation }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Cyberpunk glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen text-center">
        {/* Header */}
        <div className="mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-8">
            <Shield className="w-20 h-20 text-green-400 mr-6 animate-pulse drop-shadow-lg" />
            <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
              Alien Recon Lab
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Discover, Investigate, and Reveal the Alien Infiltration in Earth's Digital Realm
          </p>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={onBeginInvestigation}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-bold py-6 px-12 rounded-lg text-2xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 border border-green-400/30"
        >
          <Zap className="w-8 h-8 mr-3 animate-pulse" />
          Begin Investigation
        </Button>

        {/* Status indicator */}
        <div className="mt-16 flex items-center text-green-400 animate-pulse">
          <div className="w-4 h-4 bg-green-400 rounded-full mr-4 shadow-lg shadow-green-400/50"></div>
          <span className="text-lg font-mono tracking-wider">QUANTUM LINK ESTABLISHED • READY FOR DEPLOYMENT</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
