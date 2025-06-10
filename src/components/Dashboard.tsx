
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, Trophy, Target, Lock, CheckCircle, Clock, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMissions, useMissionCompletions } from '@/hooks/useMissions';

interface DashboardProps {
  user: any;
  onMissionSelect: (mission: any) => void;
}

const Dashboard = ({ user, onMissionSelect }: DashboardProps) => {
  const { data: missions = [], isLoading: missionsLoading } = useMissions();
  const { data: completions = [], isLoading: completionsLoading } = useMissionCompletions();

  if (missionsLoading || completionsLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-green-400 animate-spin mx-auto mb-4" />
          <p className="text-green-400">Loading mission data...</p>
        </div>
      </div>
    );
  }

  const completedMissionIds = completions.map(c => c.missionId);
  const totalMissions = missions.length;
  const completedCount = completedMissionIds.length;
  const progressPercentage = totalMissions > 0 ? (completedCount / totalMissions) * 100 : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getMissionStatus = (mission: any) => {
    if (completedMissionIds.includes(mission._id)) return 'completed';
    // For now, all missions are available - you can add unlock logic later
    return 'available';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'available': return <Target className="w-5 h-5 text-blue-500" />;
      case 'locked': return <Lock className="w-5 h-5 text-gray-400" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-green-400 mb-2">Mission Control</h1>
              <p className="text-gray-400">Welcome back, Agent {user?.name}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">{user?.score || 0}</div>
              <div className="text-sm text-gray-400">Total Score</div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-800/50 border-green-400/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Shield className="w-8 h-8 text-green-400 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-white">{user?.rank || 'Rookie'}</div>
                    <div className="text-sm text-gray-400">Current Rank</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-yellow-400/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-white">{completedCount}</div>
                    <div className="text-sm text-gray-400">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-400/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-blue-400 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-white">{totalMissions - completedCount}</div>
                    <div className="text-sm text-gray-400">Remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-400/20">
              <CardContent className="p-4">
                <div>
                  <div className="text-lg font-semibold text-white mb-2">Progress</div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="text-sm text-gray-400 mt-1">{Math.round(progressPercentage)}% Complete</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => {
            const status = getMissionStatus(mission);
            return (
              <Card 
                key={mission._id}
                className={`bg-slate-800/50 border-slate-700/50 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  status === 'locked' ? 'opacity-60' : ''
                }`}
                onClick={() => status !== 'locked' && onMissionSelect(mission)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status)}
                      <CardTitle className="text-white text-lg">{mission.title}</CardTitle>
                    </div>
                    <Badge className={`${getDifficultyColor(mission.difficulty)} text-white`}>
                      {mission.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-400">
                    {mission.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-green-400">{mission.category}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Points:</span>
                      <span className="text-green-400 font-semibold">{mission.points}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Est. Time:</span>
                      <span className="text-white">{mission.estimatedTime}</span>
                    </div>

                    {status === 'available' && (
                      <div className="flex items-center text-green-400 text-sm pt-2">
                        <Download className="w-4 h-4 mr-1" />
                        Click to start investigation
                      </div>
                    )}
                    
                    {status === 'completed' && (
                      <div className="text-green-500 text-sm pt-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Investigation Complete
                      </div>
                    )}
                    
                    {status === 'locked' && (
                      <div className="text-gray-500 text-sm pt-2">
                        Complete previous missions to unlock
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
