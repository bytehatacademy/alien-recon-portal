import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Flag, CheckCircle, XCircle, Clock, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MissionDetailProps {
  mission: any;
  onBack: () => void;
  user: any;
}

const MissionDetail = ({ mission, onBack, user }: MissionDetailProps) => {
  const [flagInput, setFlagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { toast } = useToast();

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAttempts(prev => prev + 1);

    // Simulate flag validation - replace with Supabase logic
    setTimeout(() => {
      if (flagInput.trim() === mission.flag) {
        setIsCompleted(true);
        toast({
          title: "Mission Completed! 🎉",
          description: `Excellent work, Agent! You've earned ${mission.points} points.`,
        });
      } else {
        toast({
          title: "Incorrect Flag",
          description: "The evidence doesn't match. Keep investigating...",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleContinueToNext = () => {
    // This would add the mission to completed missions and go back to dashboard
    // The dashboard will then show the next mission as unlocked
    onBack();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="text-green-400 hover:text-green-300 mb-4 cyber-border"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-green-400 neon-text mb-2">{mission.title}</h1>
              <p className="text-cyan-400">{mission.category} • {mission.estimatedTime}</p>
            </div>
            <Badge className={`${getDifficultyColor(mission.difficulty)} text-white neon-glow`}>
              {mission.difficulty}
            </Badge>
          </div>
        </div>

        {/* Mission Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 bg-slate-800/50 border-green-400/30 cyber-border">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center neon-text">
                <Flag className="w-5 h-5 text-green-400 mr-2" />
                Mission Brief
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p className="mb-4">{mission.description}</p>
              <p className="text-sm text-gray-400">
                Your mission is to analyze the provided evidence and extract the hidden flag. 
                The flag format follows the pattern: <code className="bg-slate-700 px-2 py-1 rounded text-green-400">ARLab{'{flag_content}'}</code>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-400/30 cyber-border">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center neon-text">
                <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                Mission Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Points:</span>
                <span className="text-yellow-400 font-semibold">{mission.points}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Difficulty:</span>
                <span className="text-white">{mission.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span className="text-green-400">{mission.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Attempts:</span>
                <span className="text-white">{attempts}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Download Section */}
        <Card className="bg-slate-800/50 border-purple-400/30 cyber-border mb-8">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center neon-text">
              <Download className="w-5 h-5 text-purple-400 mr-2" />
              Evidence Files
            </CardTitle>
            <CardDescription className="text-gray-400">
              Download the investigation materials to begin your analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white cyber-border pulse-neon"
              onClick={() => {
                toast({
                  title: "Download Started",
                  description: "Evidence package is being prepared...",
                });
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Evidence Package
            </Button>
          </CardContent>
        </Card>

        {/* Flag Submission */}
        <Card className="bg-slate-800/50 border-green-400/30 cyber-border">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center neon-text">
              <Flag className="w-5 h-5 text-green-400 mr-2" />
              Submit Your Findings
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter the flag you discovered during your investigation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isCompleted ? (
              <form onSubmit={handleFlagSubmit} className="space-y-4">
                <div className="flex space-x-4">
                  <Input
                    type="text"
                    placeholder="ARLab{enter_flag_here}"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    className="bg-slate-700 border-green-400/30 text-white flex-1 cyber-border"
                    disabled={isSubmitting}
                  />
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700 cyber-border pulse-neon"
                    disabled={isSubmitting || !flagInput.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <Flag className="w-4 h-4 mr-2" />
                        Submit Flag
                      </>
                    )}
                  </Button>
                </div>
                
                {attempts > 0 && (
                  <div className="text-sm text-gray-400">
                    Attempts made: {attempts}
                  </div>
                )}
              </form>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 neon-glow" />
                <h3 className="text-2xl font-bold text-green-400 neon-text mb-2">Mission Accomplished!</h3>
                <p className="text-gray-400 mb-4">
                  Outstanding work, Agent {user?.name}. You've successfully completed this investigation.
                </p>
                <div className="text-green-400 font-semibold mb-6 neon-text">
                  +{mission.points} points earned
                </div>
                <Button 
                  onClick={handleContinueToNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white cyber-border pulse-neon"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue to Next Mission
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MissionDetail;
