
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, Trophy, Target, Lock, CheckCircle, Clock, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMissions, useMissionCompletions } from '@/hooks/useMissions';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

type MissionStatus = 'completed' | 'available' | 'locked';

interface Mission {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  estimated_time: string;
  file_url: string;
  isUnlocked: boolean;
}

const Dashboard = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { data: missions = [], isLoading: missionsLoading } = useMissions();
	const { data: completions = [], isLoading: completionsLoading } = useMissionCompletions();

	if (missionsLoading || completionsLoading || !user) {
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-8 h-8 text-green-400 animate-spin mx-auto mb-4" />
					<p className="text-green-400">Loading mission data...</p>
				</div>
			</div>
		);
	}

	const completedMissionIds = user.completed_missions || [];
	const totalMissions = missions.length;
	const completedCount = completedMissionIds.length;
	const remainingCount = totalMissions - completedCount;
	const progressPercentage = totalMissions > 0 ? (completedCount / totalMissions) * 100 : 0;
	const currentRank = user.rank || 'Rookie';

	// Calculate total available points
	const totalPoints = missions.reduce((sum, mission) => sum + mission.points, 0);
	const earnedPoints = user.score;
	const remainingPoints = totalPoints - earnedPoints;

	// Add helper functions for status and difficulty colors
	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty.toLowerCase()) {
			case 'beginner':
				return 'bg-green-500';
			case 'intermediate':
				return 'bg-yellow-500';
			case 'advanced':
				return 'bg-orange-500';
			case 'expert':
				return 'bg-red-500';
			default:
				return 'bg-gray-500';
		}
	};

	const getStatusIcon = (status: MissionStatus) => {
		switch (status) {
			case 'completed':
				return <CheckCircle className="w-5 h-5 text-green-500" />;
			case 'available':
				return <Target className="w-5 h-5 text-blue-500" />;
			case 'locked':
				return <Lock className="w-5 h-5 text-gray-400" />;
			default:
				return <Clock className="w-5 h-5 text-yellow-500" />;
		}
	};

	return (
		<div className="min-h-screen bg-slate-900 p-6">
			<div className="container mx-auto max-w-6xl">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-4xl font-bold text-green-400 mb-2">
								Mission Control
							</h1>
							<p className="text-gray-400">Welcome back, Agent {user?.name}</p>
						</div>
						<div className="text-right">
							<div className="text-3xl font-bold text-green-400">
								{user?.score || 0}
							</div>
							<div className="text-sm text-gray-400">Total Score</div>
						</div>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
						<Card className="bg-slate-800/50 border-green-400/20">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<Shield className="w-8 h-8 text-green-400 mr-3" />
										<div>
											<div className="text-sm font-bold text-gray-400">Current Rank</div>
											<div className="text-xl font-bold text-white">{currentRank}</div>
											<div className="text-xs text-gray-500 mt-1">
												{completedCount >= 25
													? 'Maximum Rank Achieved!'
													: completedCount >= 20
													? `${25 - completedCount} more missions for Delta Agent`
													: completedCount >= 15
													? `${20 - completedCount} more missions for Command Entity`
													: completedCount >= 10
													? `${15 - completedCount} more missions for Sigma-51`
													: completedCount >= 5
													? `${10 - completedCount} more missions for Gamma Node`
													: `${5 - completedCount} more missions for Cipher Cadet`}
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-slate-800/50 border-yellow-400/20">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<Trophy className="w-8 h-8 text-yellow-400 mr-3" />
										<div>
											<div className="text-2xl font-bold text-white">
												{completedCount}
											</div>
											<div className="text-sm text-gray-400">Completed</div>
										</div>
									</div>
									<Badge variant="outline" className="text-yellow-400 border-yellow-400">
										{earnedPoints} pts
									</Badge>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-slate-800/50 border-blue-400/20">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<Target className="w-8 h-8 text-blue-400 mr-3" />
										<div>
											<div className="text-2xl font-bold text-white">
												{remainingCount}
											</div>
											<div className="text-sm text-gray-400">Remaining</div>
										</div>
									</div>
									<Badge variant="outline" className="text-blue-400 border-blue-400">
										{remainingPoints} pts
									</Badge>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-slate-800/50 border-purple-400/20">
							<CardContent className="p-4">
								<div>
									<div className="flex items-center justify-between mb-2">
										<div className="text-lg font-semibold text-white">Progress</div>
										<Badge variant="outline" className="text-purple-400 border-purple-400">
											{Math.round(progressPercentage)}%
										</Badge>
									</div>
									<Progress value={progressPercentage} className="h-2" />
									<div className="flex justify-between text-sm text-gray-400 mt-1">
										<span>{completedCount} completed</span>
										<span>{remainingCount} remaining</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Mission Categories */}
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-green-400 mb-4">Mission Categories</h2>
					<div className="flex flex-wrap gap-2">
						{Array.from(new Set(missions.map(m => m.category))).map((category: string) => (
							<Badge
								key={category}
								variant="outline"
								className="bg-slate-700 hover:bg-slate-600 cursor-pointer px-3 py-1 border-green-400/20"
							>
								{category}
							</Badge>
						))}
					</div>
				</div>

				{/* Missions Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{missions.map((mission) => {
						let status: MissionStatus;
						const isCompleted = user?.completed_missions?.includes(mission._id);
						if (isCompleted) {
							status = 'completed';
						} else if (mission.isUnlocked) {
							status = 'available';
						} else {
							status = 'locked';
						}

						return (
							<Card
								key={mission._id}
								className={`bg-slate-800/50 border-slate-700/50 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
									status === 'locked' ? 'opacity-60' : ''
								}`}
								onClick={() => status !== 'locked' && navigate(`/missions/${mission._id}`)}
							>
								<CardHeader>
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center space-x-2">
											{getStatusIcon(status)}
											<CardTitle className="text-white text-lg">
												{mission.title}
											</CardTitle>
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
											<span className="text-green-400 font-semibold">
												{mission.points}
											</span>
										</div>

										<div className="flex justify-between items-center text-sm">
											<span className="text-gray-400">Est. Time:</span>
											<span className="text-white">{mission.estimated_time}</span>
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
