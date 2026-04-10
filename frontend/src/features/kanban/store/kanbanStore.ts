import { create } from 'zustand';
import apiClient from '../../../api/apiClient';

export type ApplicationStatus = "Applied" | "Phone Screen" | "Interview" | "Offer" | "Rejected";

export interface Application {
  _id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  dateApplied: string;
  skills?: string[];
  niceToHave?: string[];
  seniority?: string;
  location?: string;
  salaryRange?: string;
  notes?: string;
  jdLink?: string;
  resumeSuggestions?: string[];
}

interface KanbanState {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  fetchApplications: () => Promise<void>;
  updateApplicationStatus: (id: string, newStatus: ApplicationStatus) => Promise<void>;
  setApplications: (applications: Application[]) => void;
  deleteApplication: (id: string) => Promise<void>;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  applications: [],
  isLoading: false,
  error: null,
  setApplications: (applications) => set({ applications }),
  fetchApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await apiClient.get('/applications');
      set({ applications: data, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch applications', isLoading: false });
    }
  },
  updateApplicationStatus: async (id, newStatus) => {
    const { applications } = get();
    const prevApps = [...applications];
    
    set({
      applications: applications.map(app => 
        app._id === id ? { ...app, status: newStatus } : app
      )
    });

    try {
      await apiClient.patch(`/applications/${id}`, { status: newStatus });
    } catch {
      set({ applications: prevApps, error: 'Failed to update status' });
    }
  },
  deleteApplication: async (id) => {
    const { applications } = get();
    const prevApps = [...applications];
    
    set({ applications: applications.filter(app => app._id !== id) });
    try {
      await apiClient.delete(`/applications/${id}`);
    } catch {
      set({ applications: prevApps, error: 'Failed to delete custom error' });
    }
  }
}));
