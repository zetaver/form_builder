import { create } from 'zustand';
import api from '../config/api';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
}

interface Team {
  _id: string;
  name: string;
  description?: string;
  members: Member[];
  createdAt: string;
}

interface TeamStore {
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  fetchTeams: () => Promise<void>;
  createTeam: (team: { name: string; description?: string }) => Promise<Team>;
  updateTeam: (teamId: string, team: { name: string; description?: string }) => Promise<Team>;
  deleteTeam: (teamId: string) => Promise<void>;
  addMember: (teamId: string, email: string, role?: string) => Promise<Team>;
  removeMember: (teamId: string, memberId: string) => Promise<Team>;
  updateMemberRole: (teamId: string, memberId: string, role: string) => Promise<Team>;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: [],
  isLoading: false,
  error: null,

  fetchTeams: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/teams');
      set({ teams: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch teams',
        isLoading: false
      });
      throw error;
    }
  },

  createTeam: async (team) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/teams', team);
      const newTeam = response.data;
      set((state) => ({
        teams: [...state.teams, newTeam],
        isLoading: false
      }));
      return newTeam;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create team',
        isLoading: false
      });
      throw error;
    }
  },

  updateTeam: async (teamId, team) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put(`/teams/${teamId}`, team);
      const updatedTeam = response.data;
      set((state) => ({
        teams: state.teams.map(t => t._id === teamId ? updatedTeam : t),
        isLoading: false
      }));
      return updatedTeam;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update team',
        isLoading: false
      });
      throw error;
    }
  },

  deleteTeam: async (teamId) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/teams/${teamId}`);
      set((state) => ({
        teams: state.teams.filter(t => t._id !== teamId),
        isLoading: false
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete team',
        isLoading: false
      });
      throw error;
    }
  },

  addMember: async (teamId, email, role) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post(`/teams/${teamId}/members`, { email, role });
      const updatedTeam = response.data;
      set((state) => ({
        teams: state.teams.map(t => t._id === teamId ? updatedTeam : t),
        isLoading: false
      }));
      return updatedTeam;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add team member',
        isLoading: false
      });
      throw error;
    }
  },

  removeMember: async (teamId, memberId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.delete(`/teams/${teamId}/members/${memberId}`);
      const updatedTeam = response.data;
      set((state) => ({
        teams: state.teams.map(t => t._id === teamId ? updatedTeam : t),
        isLoading: false
      }));
      return updatedTeam;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to remove team member',
        isLoading: false
      });
      throw error;
    }
  },

  updateMemberRole: async (teamId, memberId, role) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put(`/teams/${teamId}/members/${memberId}`, { role });
      const updatedTeam = response.data;
      set((state) => ({
        teams: state.teams.map(t => t._id === teamId ? updatedTeam : t),
        isLoading: false
      }));
      return updatedTeam;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update member role',
        isLoading: false
      });
      throw error;
    }
  },
}));