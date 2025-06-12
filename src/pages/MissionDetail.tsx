
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMissions } from '@/hooks/useMissions';
import MissionDetailComponent from '@/components/MissionDetailComponent';
import { Loader2 } from 'lucide-react';

const MissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: missions = [], isLoading } = useMissions();
  const mission = missions.find(m => m._id === id);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 p-4 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-400 animate-spin mb-4" />
        <p className="text-green-400">Loading mission data...</p>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-slate-900 p-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Mission not found</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-green-400 hover:text-green-300"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/dashboard');
  };
  
  const isCompleted = user?.completed_missions?.includes(mission._id);

  // Transform mission data to match MissionDetailComponent expectations
  const transformedMission = {
    _id: mission._id,
    title: mission.title,
    description: mission.description,
    category: mission.category,
    difficulty: mission.difficulty,
    points: mission.points,
    estimatedTime: mission.estimated_time, // Transform snake_case to camelCase
    fileUrl: mission.file_url, // Transform snake_case to camelCase
  };

  return (
    <MissionDetailComponent 
      mission={transformedMission}
      onBack={handleBack}
      user={user}
      isCompleted={isCompleted}
    />
  );
};

export default MissionDetailPage;
