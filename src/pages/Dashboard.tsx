import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/components/Dashboard';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-green-400 mb-2">Mission Control</h1>
        <p className="text-slate-400 mb-8">Welcome back, Agent {user?.name}</p>
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
