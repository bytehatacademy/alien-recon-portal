
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, Trophy, Target, Lock, CheckCircle, Clock, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  user: any;
  onMissionSelect: (mission: any) => void;
  completedMissions?: number[];
}

// Updated missions with proper progression logic
const missions = [
  {
    id: 1,
    title: "Recon Rumble",
    description: "Analyze intercepted alien communication patterns to identify infiltration methods.",
    difficulty: "Beginner",
    points: 100,
    estimatedTime: "30 min",
    fileUrl: "#",
    flag: "ARLab{welcome_to_the_investigation}",
    category: "OSINT",
    unlockRequirement: null // Always unlocked
  },
  {
    id: 2,
    title: "Packet Puzzle",
    description: "Examine network traffic to uncover hidden alien data transmissions.",
    difficulty: "Intermediate",
    points: 250,
    estimatedTime: "45 min",
    fileUrl: "#",
    flag: "ARLab{network_anomaly_detected}",
    category: "Network Analysis",
    unlockRequirement: 1 // Requires mission 1
  },
  {
    id: 3,
    title: "Memory Maze",
    description: "Perform memory forensics on an infected system to find alien artifacts.",
    difficulty: "Advanced",
    points: 400,
    estimatedTime: "60 min",
    fileUrl: "#",
    flag: "ARLab{memory_corruption_found}",
    category: "Digital Forensics",
    unlockRequirement: 2 // Requires mission 2
  },
  {
    id: 4,
    title: "APT Archive",
    description: "Investigate an advanced persistent threat with alien origins.",
    difficulty: "Expert",
    points: 600,
    estimatedTime: "90 min",
    fileUrl: "#",
    flag: "ARLab{apt_source_identified}",
    category: "Threat Intelligence",
    unlockRequirement: 3 // Requires mission 3
  },
  {
    id: 5,
    title: "Alien OSINT",
    description: "Use open source intelligence to track alien infiltration activities.",
    difficulty: "Intermediate",
    points: 300,
    estimatedTime: "45 min",
    fileUrl: "#",
    flag: "ARLab{osint_investigation_complete}",
    category: "OSINT",
    unlockRequirement: 4 // Requires mission 4
  }
];

const Dashboard = ({ user, onMissionSelect, completedMissions = [] }: DashboardProps) => {
  const totalMissions = missions.length;
  const completedCount = completedMissions.length;
  const progressPercentage = (completedCount / totalMissions) * 100;

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
    if (completedMissions.includes(mission.id)) return 'completed';
    if (!mission.unlockRequirement || completedMissions.includes(mission.unlockRequirement)) return 'available';
    return 'locked';
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
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Mission Control</h1>
              <p className="text-muted-foreground">Welcome back, Agent {user?.name}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{user?.score || 0}</div>
              <div className="text-sm text-muted-foreground">Total Score</div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Shield className="w-8 h-8 text-primary mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">{user?.rank || 'Rookie'}</div>
                    <div className="text-sm text-muted-foreground">Current Rank</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Trophy className="w-8 h-8 text-primary mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">{completedCount}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-primary mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">{totalMissions - completedCount}</div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div>
                  <div className="text-lg font-semibold text-foreground mb-2">Progress</div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="text-sm text-muted-foreground mt-1">{Math.round(progressPercentage)}% Complete</div>
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
                key={mission.id}
                className={`hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  status === 'locked' ? 'opacity-60' : ''
                }`}
                onClick={() => status !== 'locked' && onMissionSelect(mission)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status)}
                      <CardTitle className="text-foreground text-lg">{mission.title}</CardTitle>
                    </div>
                    <Badge className={`${getDifficultyColor(mission.difficulty)} text-white`}>
                      {mission.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>
                    {mission.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="text-primary">{mission.category}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Points:</span>
                      <span className="text-primary font-semibold">{mission.points}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Est. Time:</span>
                      <span className="text-foreground">{mission.estimatedTime}</span>
                    </div>

                    {status === 'available' && (
                      <div className="flex items-center text-primary text-sm pt-2">
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
                      <div className="text-muted-foreground text-sm pt-2">
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
