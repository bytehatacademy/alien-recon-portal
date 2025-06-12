const API_BASE_URL = '/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: this.getHeaders(),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Auth methods
  async register(userData: { email: string; name: string; password: string }) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.success && data.data.token) {
      this.token = data.data.token;
      localStorage.setItem('auth_token', this.token);
    }
    
    return data;
  }

  async login(credentials: { email: string; password: string }) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.success && data.data.token) {
      this.token = data.data.token;
      localStorage.setItem('auth_token', this.token);
    }
    
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData: { name?: string; avatar?: string }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Mission methods
  async getMissions() {
    return this.request('/missions');
  }

  async getMissionById(id: string) {
    return this.request(`/missions/${id}`);
  }

  async getMissionCompletion(missionId: string) {
    return this.request(`/missions/${missionId}/completion`);
  }

  async submitFlag(missionId: string, flag: string) {
    return this.request(`/missions/${missionId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ flag }),
    }).then(response => ({
      ...response,
      data: {
        ...response.data,
        oldRank: response.data.oldRank,
        newRank: response.data.newRank
      }
    }));
  }

  async getMissionCompletions() {
    const response = await this.request('/users/profile');
    return {
      success: true,
      data: {
        completions: response.data?.completedMissions || []
      }
    };
  }

  // User methods
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async getLeaderboard(limit = 50, page = 1) {
    return this.request(`/users/leaderboard?limit=${limit}&page=${page}`);
  }

  async getUserActivities(limit = 20, page = 1) {
    return this.request(`/users/activities?limit=${limit}&page=${page}`);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }
}

export const apiService = new ApiService();
