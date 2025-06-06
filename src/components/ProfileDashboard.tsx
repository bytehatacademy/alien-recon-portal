
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { User, Trophy, Target, Shield, X, Brain, Search, Bug, Zap, Eye, FileSearch, Users } from 'lucide-react';

interface ProfileDashboardProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileDashboard = ({ user, isOpen, onClose }: ProfileDashboardProps) => {
  if (!isOpen) return null;

  const skills = [
    { name: 'Threat Hunting', icon: Search, progress: 75, color: 'text-green-400' },
    { name: 'Forensics', icon: FileSearch, progress: 60, color: 'text-blue-400' },
    { name: 'Malware Reverse Engineering', icon: Bug, progress: 45, color: 'text-purple-400' },
    { name: 'Covert Channel Detection', icon: Eye, progress: 30, color: 'text-yellow-400' },
    { name: 'SIGINT and Attribution', icon: Zap, progress: 40, color: 'text-red-400' },
    { name: 'Disinformation Tracing', icon: Brain, progress: 35, color: 'text-cyan-400' },
    { name: 'Cyber Deception', icon: Users, progress: 25, color: 'text-pink-400' }
  ];

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'Rookie': return 'bg-green-500';
      case 'Agent': return 'bg-blue-500';
      case 'Analyst': return 'bg-purple-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-end z-50">
      <div className="w-96 bg-slate-900/95 backdrop-blur-sm border-l border-green-400/30 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-400 neon-text">Agent Profile</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-green-400 hover:text-green-300">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User Info */}
        <Card className="bg-slate-800/50 border-green-400/20 mb-6 cyber-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-16 h-16 border-2 border-green-400 neon-glow">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-slate-700 text-green-400 font-bold">
                  {user?.name?.slice(0, 2)?.toUpperCase() || 'AG'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-white">{user?.name || 'Agent'}</h3>
                <Badge className={`${getRankBadgeColor(user?.rank)} text-white`}>
                  {user?.rank || 'Rookie'}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{user?.score || 0}</div>
                <div className="text-gray-400">Total Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{user?.completedMissions?.length || 0}</div>
                <div className="text-gray-400">Missions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Progress */}
        <Card className="bg-slate-800/50 border-purple-400/20 mb-6">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Skill Development
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <skill.icon className={`w-4 h-4 ${skill.color}`} />
                    <span className="text-sm text-white">{skill.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{skill.progress}%</span>
                </div>
                <Progress value={skill.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="bg-slate-800/50 border-yellow-400/20">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-2 bg-slate-700/30 rounded">
              <Target className="w-4 h-4 text-green-400" />
              <div className="text-sm">
                <div className="text-white">Completed: Recon Rumble</div>
                <div className="text-gray-400 text-xs">+100 points</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-slate-700/30 rounded">
              <Shield className="w-4 h-4 text-blue-400" />
              <div className="text-sm">
                <div className="text-white">Rank promoted to Agent</div>
                <div className="text-gray-400 text-xs">Achievement unlocked</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileDashboard;
