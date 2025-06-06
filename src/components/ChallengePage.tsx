
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Terminal, Upload, Flag, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ChallengePageProps {
  onBack: () => void;
}

const ChallengePage = ({ onBack }: ChallengePageProps) => {
  const [flagInput, setFlagInput] = useState('');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  
  const terminalContent = [
    '> Accessing Alien Recon Lab Terminal...',
    '> Quantum encryption bypassed...',
    '> Loading intercepted transmission data...',
    '',
    '=== MISSION: RECON RUMBLE ===',
    '',
    'Agent, we have intercepted an alien transmission containing',
    'critical intelligence about their infiltration methods.',
    '',
    'Your task:',
    '1. Analyze the provided data packet',
    '2. Extract hidden communication patterns',
    '3. Identify the alien command structure',
    '4. Submit the discovered flag format: ARL{...}',
    '',
    'Available tools: Network analyzer, Hex editor, Frequency scanner',
    '',
    '> Download transmission data below',
    '> Good luck, Agent. Earth is counting on you.',
    ''
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentLine < terminalContent.length) {
        setTerminalLines(prev => [...prev, terminalContent[currentLine]]);
        setCurrentLine(prev => prev + 1);
      } else {
        clearInterval(timer);
      }
    }, 300);

    return () => clearInterval(timer);
  }, [currentLine]);

  const handleSubmitFlag = () => {
    if (flagInput.toLowerCase().includes('arl{')) {
      setTerminalLines(prev => [...prev, '', '> Flag submitted...', '> Analyzing...', '> SUCCESS! Mission completed!']);
    } else {
      setTerminalLines(prev => [...prev, '', '> Invalid flag format. Try again.']);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Terminal-style background */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Matrix-style background effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ctext%20x%3D%220%22%20y%3D%2215%22%20font-family%3D%22monospace%22%20font-size%3D%2210%22%20fill%3D%22%2300ff00%22%20opacity%3D%220.1%22%3E0%3C/text%3E%3C/svg%3E')] opacity-30"></div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={onBack}
            variant="ghost"
            className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Briefing
          </Button>
          
          <div className="flex items-center text-green-400">
            <Terminal className="w-6 h-6 mr-2 animate-pulse" />
            <span className="font-mono text-lg">SECURE TERMINAL • AGENT AUTHENTICATED</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Terminal Interface */}
          <Card className="bg-black/80 border-green-400/30 shadow-2xl shadow-green-400/10">
            <CardContent className="p-6">
              <div className="bg-black rounded p-4 font-mono text-sm text-green-400 h-96 overflow-y-auto">
                {terminalLines.map((line, index) => (
                  <div key={index} className="mb-1">
                    {line}
                    {index === terminalLines.length - 1 && <span className="animate-pulse">_</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Challenge Interface */}
          <div className="space-y-6">
            {/* Download Section */}
            <Card className="bg-slate-800/80 border-blue-400/30 shadow-lg shadow-blue-400/10">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Upload className="w-5 h-5 text-blue-400 mr-2" />
                  <h3 className="text-xl font-bold text-blue-400 font-mono">TRANSMISSION DATA</h3>
                </div>
                <p className="text-gray-300 mb-4 font-mono text-sm">
                  Intercepted alien communication packet (encrypted)
                </p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-mono"
                  onClick={() => alert('In a real CTF, this would download the challenge file!')}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Download transmission.pcap
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Tools */}
            <Card className="bg-slate-800/80 border-purple-400/30 shadow-lg shadow-purple-400/10">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Eye className="w-5 h-5 text-purple-400 mr-2" />
                  <h3 className="text-xl font-bold text-purple-400 font-mono">ANALYSIS TOOLS</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="font-mono text-xs">Wireshark</Button>
                  <Button variant="outline" size="sm" className="font-mono text-xs">HxD Editor</Button>
                  <Button variant="outline" size="sm" className="font-mono text-xs">Audacity</Button>
                  <Button variant="outline" size="sm" className="font-mono text-xs">CyberChef</Button>
                </div>
              </CardContent>
            </Card>

            {/* Flag Submission */}
            <Card className="bg-slate-800/80 border-green-400/30 shadow-lg shadow-green-400/10">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Flag className="w-5 h-5 text-green-400 mr-2" />
                  <h3 className="text-xl font-bold text-green-400 font-mono">SUBMIT FLAG</h3>
                </div>
                <div className="space-y-4">
                  <Input
                    placeholder="ARL{enter_discovered_flag_here}"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    className="bg-black/50 border-green-400/30 text-green-400 font-mono placeholder:text-green-400/50"
                  />
                  <Button 
                    onClick={handleSubmitFlag}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-mono"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Submit Flag
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
