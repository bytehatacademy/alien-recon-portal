
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Flag, CheckCircle, XCircle, Clock, Trophy, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{mission.title}</h1>
              <p className="text-muted-foreground">{mission.category} • {mission.estimatedTime}</p>
            </div>
            <Badge className={`${getDifficultyColor(mission.difficulty)} text-white`}>
              {mission.difficulty}
            </Badge>
          </div>
        </div>

        {/* Mission Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Flag className="w-5 h-5 mr-2" />
                Mission Brief
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">{mission.description}</p>
              <p className="text-sm">
                Your mission is to analyze the provided evidence and extract the hidden flag. 
                The flag format follows the pattern: <code className="bg-muted px-2 py-1 rounded text-primary">ARLab{'{flag_content}'}</code>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Mission Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Points:</span>
                <span className="text-primary font-semibold">{mission.points}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty:</span>
                <span className="text-foreground">{mission.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="text-primary">{mission.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Attempts:</span>
                <span className="text-foreground">{attempts}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Download Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Evidence Files
            </CardTitle>
            <CardDescription>
              Download the investigation materials to begin your analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="bg-primary hover:bg-primary/90"
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
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Flag className="w-5 h-5 mr-2" />
              Submit Your Findings
            </CardTitle>
            <CardDescription>
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
                    className="flex-1"
                    disabled={isSubmitting}
                  />
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90"
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
                  <div className="text-sm text-muted-foreground">
                    Attempts made: {attempts}
                  </div>
                )}
              </form>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Mission Accomplished!</h3>
                <p className="text-muted-foreground mb-4">
                  Outstanding work, Agent {user?.name}. You've successfully completed this investigation.
                </p>
                <div className="text-primary font-semibold mb-6">
                  +{mission.points} points earned
                </div>
                <Button 
                  onClick={handleContinueToNext}
                  className="bg-primary hover:bg-primary/90"
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
