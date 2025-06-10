
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useAuth } from './useAuth';

export function useMissions() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['missions'],
    queryFn: () => apiService.getMissions(),
    enabled: isAuthenticated,
    select: (data) => data.data?.missions || [],
  });
}

export function useMissionCompletions() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['mission-completions'],
    queryFn: () => apiService.getMissionCompletions(),
    enabled: isAuthenticated,
    select: (data) => data.data?.completions || [],
  });
}
