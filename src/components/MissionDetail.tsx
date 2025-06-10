
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Flag, CheckCircle, Clock, Trophy, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

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
  const { updateUser } = useAuth();

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAttempts(prev => prev + 1);

    try {
      const response = await apiService.submitFlag(mission._id, flagInput.trim());
      
      if (response.success) {
        setIsCompleted(true);
        // Update user score
        if (user && response.data.pointsEarned) {
          updateUser({
            ...user,
            score: (user.score || 0) + response.data.pointsEarned
          });
        }
        
        toast({
          title: "Mission Completed! 🎉",
          description: `Excellent work, Agent! You've earned ${mission.points} points.`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Incorrect Flag",
        description: error.message || "The evidence doesn't match. Keep investigating...",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToNext = () => {
    onBack();
  };

  const handleDownload = () => {
    if (mission.fileUrl && mission.fileUrl !== '#') {
      // Open the file URL in a new tab
      window.open(mission.fileUrl, '_blank');
    } else {
      toast({
        title: "Download Started",
        description: "Evidence package is being prepared...",
      });
    }
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
    <div className="min-h-screen bg-slate-900 p-4 md:p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="text-green-400 hover:text-green-300 hover:bg-slate-800/50 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-green-400 mb-2">{mission.title}</h1>
              <p className="text-slate-400 text-sm md:text-base">{mission.category} • {mission.estimatedTime}</p>
            </div>
            <Badge className={`${getDifficultyColor(mission.difficulty)} text-white self-start md:self-center`}>
              {mission.difficulty}
            </Badge>
          </div>
        </div>

        {/* Mission Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="lg:col-span-2 bg-slate-800/50 border-green-400/20">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center text-lg md:text-xl">
                <Flag className="w-5 h-5 mr-2" />
                Mission Brief
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              <p className="mb-4 text-sm md:text-base">{mission.description}</p>
              {mission.briefing && (
                <p className="mb-4 text-sm md:text-base">{mission.briefing}</p>
              )}
              <p className="text-xs md:text-sm">
                Your mission is to analyze the provided evidence and extract the hidden flag. 
                The flag format follows the pattern: <code className="bg-slate-700 px-2 py-1 rounded text-green-400">ARLab{'{flag_content}'}</code>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-400/20">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center text-lg md:text-xl">
                <Trophy className="w-5 h-5 mr-2" />
                Mission Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-slate-400">Points:</span>
                <span className="text-green-400 font-semibold">{mission.points}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-slate-400">Difficulty:</span>
                <span className="text-white">{mission.difficulty}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-slate-400">Category:</span>
                <span className="text-blue-400">{mission.category}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-slate-400">Attempts:</span>
                <span className="text-white">{attempts}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Download Section */}
        <Card className="mb-6 md:mb-8 bg-slate-800/50 border-blue-400/20">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center text-lg md:text-xl">
              <Download className="w-5 h-5 mr-2" />
              Evidence Files
            </CardTitle>
            <CardDescription className="text-slate-400">
              Download the investigation materials to begin your analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="bg-blue-500 hover:bg-blue-600 w-full md:w-auto"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Evidence Package
            </Button>
          </CardContent>
        </Card>

        {/* Flag Submission */}
        <Card className="bg-slate-800/50 border-yellow-400/20">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center text-lg md:text-xl">
              <Flag className="w-5 h-5 mr-2" />
              Submit Your Findings
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter the flag you discovered during your investigation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isCompleted ? (
              <form onSubmit={handleFlagSubmit} className="space-y-4">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <Input
                    type="text"
                    placeholder="ARLab{enter_flag_here}"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    disabled={isSubmitting}
                  />
                  <Button 
                    type="submit" 
                    className="bg-green-500 hover:bg-green-600 w-full md:w-auto"
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
                  <div className="text-sm text-slate-400">
                    Attempts made: {attempts}
                  </div>
                )}
              </form>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 md:w-16 h-12 md:h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl md:text-2xl font-bold text-green-400 mb-2">Mission Accomplished!</h3>
                <p className="text-slate-400 mb-4 text-sm md:text-base">
                  Outstanding work, Agent {user?.name}. You've successfully completed this investigation.
                </p>
                <div className="text-green-400 font-semibold mb-6 text-lg md:text-xl">
                  +{mission.points} points earned
                </div>
                <Button 
                  onClick={handleContinueToNext}
                  className="bg-green-500 hover:bg-green-600 w-full md:w-auto"
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
