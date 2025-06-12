
import { supabase } from '@/integrations/supabase/client';

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  estimated_time: string;
  category: string;
  flag: string;
  file_url?: string;
  unlock_requirement?: string;
  hints: any[];
  is_active: boolean;
  mission_order: number;
  isUnlocked?: boolean;
  briefing?: string;
}

export interface MissionCompletion {
  id: string;
  user_id: string;
  mission_id: string;
  completed_at: string;
  attempts: number;
  hints_used: number;
  points_earned: number;
  time_spent: number;
  flag_submitted: string;
}

export class SupabaseService {
  // Mission methods
  async getMissions() {
    try {
      const { data: missions, error } = await supabase
        .from('missions')
        .select('*')
        .eq('is_active', true)
        .order('mission_order');

      if (error) throw error;

      // Get user's completed missions to determine unlocked status
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('completed_missions')
          .eq('id', user.id)
          .single();

        const completedMissionIds = profile?.completed_missions || [];

        // Determine which missions are unlocked
        const missionsWithUnlockStatus = missions?.map(mission => {
          const isCompleted = completedMissionIds.includes(mission.id);
          const isUnlocked = !mission.unlock_requirement || 
                           completedMissionIds.includes(mission.unlock_requirement);

          return {
            ...mission,
            _id: mission.id, // For compatibility with existing code
            isUnlocked: isUnlocked || isCompleted
          };
        });

        return {
          success: true,
          data: { missions: missionsWithUnlockStatus }
        };
      }

      return {
        success: true,
        data: { 
          missions: missions?.map(m => ({ ...m, _id: m.id, isUnlocked: true })) || [] 
        }
      };
    } catch (error: any) {
      console.error('Error fetching missions:', error);
      throw new Error(error.message || 'Failed to fetch missions');
    }
  }

  async getMissionById(id: string) {
    try {
      const { data: mission, error } = await supabase
        .from('missions')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: { 
          mission: { 
            ...mission, 
            _id: mission.id // For compatibility
          } 
        }
      };
    } catch (error: any) {
      console.error('Error fetching mission:', error);
      throw new Error(error.message || 'Mission not found');
    }
  }

  async getMissionCompletion(missionId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: completion, error } = await supabase
        .from('mission_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('mission_id', missionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return {
        success: true,
        data: completion ? { flagSubmitted: completion.flag_submitted } : null
      };
    } catch (error: any) {
      console.error('Error fetching mission completion:', error);
      throw new Error(error.message || 'Failed to fetch completion data');
    }
  }

  async submitFlag(missionId: string, flag: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get mission details
      const { data: mission, error: missionError } = await supabase
        .from('missions')
        .select('*')
        .eq('id', missionId)
        .single();

      if (missionError) throw missionError;

      // Validate flag
      if (mission.flag !== flag) {
        throw new Error('Incorrect flag');
      }

      // Check if already completed
      const { data: existingCompletion } = await supabase
        .from('mission_completions')
        .select('id')
        .eq('user_id', user.id)
        .eq('mission_id', missionId)
        .single();

      if (existingCompletion) {
        return {
          success: true,
          data: {
            pointsEarned: 0,
            message: 'Mission already completed'
          }
        };
      }

      // Get current user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const oldRank = profile.rank;

      // Create completion record
      const { error: completionError } = await supabase
        .from('mission_completions')
        .insert({
          user_id: user.id,
          mission_id: missionId,
          points_earned: mission.points,
          flag_submitted: flag
        });

      if (completionError) throw completionError;

      // Update user profile
      const newCompletedMissions = [...(profile.completed_missions || []), missionId];
      const newScore = profile.score + mission.points;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          completed_missions: newCompletedMissions,
          score: newScore,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Get updated profile to check for rank change
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('rank')
        .eq('id', user.id)
        .single();

      const newRank = updatedProfile?.rank || oldRank;

      // Create activity record
      await supabase
        .from('activities')
        .insert({
          user_id: user.id,
          type: 'mission_completed',
          title: 'Mission Completed',
          description: `Completed mission: ${mission.title}`,
          points: mission.points,
          metadata: { missionId, flag, pointsEarned: mission.points }
        });

      return {
        success: true,
        data: {
          pointsEarned: mission.points,
          oldRank,
          newRank,
          message: 'Mission completed successfully!'
        }
      };
    } catch (error: any) {
      console.error('Error submitting flag:', error);
      throw new Error(error.message || 'Failed to submit flag');
    }
  }

  // User methods
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: { user: profile }
      };
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      throw new Error(error.message || 'Failed to fetch user data');
    }
  }

  async getUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: profile
      };
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      throw new Error(error.message || 'Failed to fetch profile');
    }
  }

  async updateProfile(profileData: { name?: string; avatar?: string }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: { user: data }
      };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  async getLeaderboard(limit = 50, page = 1) {
    try {
      const offset = (page - 1) * limit;

      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, name, rank, score, avatar, completed_missions')
        .eq('is_active', true)
        .order('score', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        success: true,
        data: {
          users: users?.map((user, index) => ({
            ...user,
            position: offset + index + 1,
            totalMissionsCompleted: user.completed_missions?.length || 0
          })) || []
        }
      };
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      throw new Error(error.message || 'Failed to fetch leaderboard');
    }
  }

  async getUserActivities(limit = 20, page = 1) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const offset = (page - 1) * limit;

      const { data: activities, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        success: true,
        data: { activities: activities || [] }
      };
    } catch (error: any) {
      console.error('Error fetching user activities:', error);
      throw new Error(error.message || 'Failed to fetch activities');
    }
  }

  async getMissionCompletions() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: completions, error } = await supabase
        .from('mission_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: { completions: completions || [] }
      };
    } catch (error: any) {
      console.error('Error fetching mission completions:', error);
      throw new Error(error.message || 'Failed to fetch completions');
    }
  }
}

export const supabaseService = new SupabaseService();
