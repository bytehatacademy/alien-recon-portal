
import { supabaseService } from './supabaseService';

// Legacy API service that now proxies to Supabase
class ApiService {
  // Auth methods - now handled by Supabase Auth in useAuth hook
  async register(userData: { email: string; name: string; password: string }) {
    // This is now handled directly in the useAuth hook
    throw new Error('Use useAuth hook for registration');
  }

  async login(credentials: { email: string; password: string }) {
    // This is now handled directly in the useAuth hook
    throw new Error('Use useAuth hook for login');
  }

  async getCurrentUser() {
    return supabaseService.getCurrentUser();
  }

  async updateProfile(profileData: { name?: string; avatar?: string }) {
    return supabaseService.updateProfile(profileData);
  }

  // Mission methods - proxy to Supabase service
  async getMissions() {
    return supabaseService.getMissions();
  }

  async getMissionById(id: string) {
    return supabaseService.getMissionById(id);
  }

  async getMissionCompletion(missionId: string) {
    return supabaseService.getMissionCompletion(missionId);
  }

  async submitFlag(missionId: string, flag: string) {
    return supabaseService.submitFlag(missionId, flag);
  }

  async getMissionCompletions() {
    return supabaseService.getMissionCompletions();
  }

  // User methods - proxy to Supabase service
  async getUserProfile() {
    return supabaseService.getUserProfile();
  }

  async getLeaderboard(limit = 50, page = 1) {
    return supabaseService.getLeaderboard(limit, page);
  }

  async getUserActivities(limit = 20, page = 1) {
    return supabaseService.getUserActivities(limit, page);
  }

  logout() {
    // This is now handled directly in the useAuth hook
    throw new Error('Use useAuth hook for logout');
  }
}

export const apiService = new ApiService();
