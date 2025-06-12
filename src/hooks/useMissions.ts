
import { useQuery } from '@tanstack/react-query';
import { supabaseService } from '@/services/supabaseService';
import { useAuth } from './useAuth';

export function useMissions() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['missions'],
    queryFn: () => supabaseService.getMissions(),
    enabled: isAuthenticated,
    select: (data) => data.data?.missions || [],
  });
}

export function useMissionCompletions() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['mission-completions'],
    queryFn: () => supabaseService.getMissionCompletions(),
    enabled: isAuthenticated,
    select: (data) => data.data?.completions || [],
  });
}
