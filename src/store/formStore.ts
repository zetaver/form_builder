import { create } from 'zustand';
import { FormElement, Form, Project } from '../types/form';
import api from '../config/api';

interface FormStore {
  projects: Project[];
  forms: Form[];
  currentProject: Project | null;
  currentForm: Form | null;
  isLoading: boolean;
  error: string | null;
  setCurrentForm: (form: Form | null) => void;
  updateForm: (form: Form) => void;
  addElement: (element: FormElement) => void;
  removeElement: (elementId: string) => void;
  updateElement: (elementId: string, element: FormElement) => void;
  reorderElements: (elements: FormElement[]) => void;
  createProject: (project: Omit<Project, '_id' | 'createdAt'>) => Promise<Project>;
  updateProject: (projectId: string, project: Partial<Project>) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
  setCurrentProject: (projectId: string) => void;
  createForm: (form: Omit<Form, '_id' | 'projectId' | 'createdAt'>) => Promise<Form | null>;
  deleteForm: (formId: string) => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchProjectForms: (projectId: string) => Promise<void>;
  fetchForm: (formId: string) => Promise<void>;
  saveForm: (formId: string, form: Partial<Form>) => Promise<void>;
}

export const useFormStore = create<FormStore>()((set, get) => ({
  projects: [],
  forms: [],
  currentProject: null,
  currentForm: null,
  isLoading: false,
  error: null,

  fetchForm: async (formId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/forms/${formId}`);
      set({ currentForm: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch form',
        isLoading: false
      });
      throw error;
    }
  },

  saveForm: async (formId: string, form: Partial<Form>) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put(`/forms/${formId}`, form);
      set({ 
        currentForm: response.data,
        forms: get().forms.map(f => f._id === formId ? response.data : f),
        isLoading: false 
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to save form',
        isLoading: false
      });
      throw error;
    }
  },

  fetchProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/projects');
      set({ projects: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch projects',
        isLoading: false 
      });
      throw error;
    }
  },

  fetchProjectForms: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/projects/${projectId}/forms`);
      set({ forms: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch forms',
        isLoading: false
      });
      throw error;
    }
  },

  createProject: async (project) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/projects', project);
      const newProject = response.data;
      
      set((state) => ({
        projects: [...state.projects, newProject],
        currentProject: newProject,
        isLoading: false
      }));
      
      return newProject;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create project',
        isLoading: false 
      });
      throw error;
    }
  },

  updateProject: async (projectId, project) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put(`/projects/${projectId}`, project);
      const updatedProject = response.data;
      
      set((state) => ({
        projects: state.projects.map(p => p._id === projectId ? updatedProject : p),
        currentProject: state.currentProject?._id === projectId ? updatedProject : state.currentProject,
        isLoading: false
      }));
      
      return updatedProject;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update project',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteProject: async (projectId) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/projects/${projectId}`);
      
      set((state) => ({
        projects: state.projects.filter(p => p._id !== projectId),
        currentProject: state.currentProject?._id === projectId ? null : state.currentProject,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete project',
        isLoading: false 
      });
      throw error;
    }
  },

  setCurrentProject: (projectId) => {
    const project = get().projects.find((p) => p._id === projectId);
    set({ currentProject: project || null });
  },

  createForm: async (form) => {
    const currentProject = get().currentProject;
    if (!currentProject) return null;

    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/forms', {
        ...form,
        projectId: currentProject._id,
      });

      const newForm = response.data;
      set((state) => ({
        forms: [...state.forms, newForm],
        currentForm: newForm,
        isLoading: false
      }));
      
      return newForm;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create form',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteForm: async (formId) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/forms/${formId}`);
      set((state) => ({
        forms: state.forms.filter(form => form._id !== formId),
        currentForm: state.currentForm?._id === formId ? null : state.currentForm,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete form',
        isLoading: false 
      });
      throw error;
    }
  },

  setCurrentForm: (form) => set({ currentForm: form }),
  updateForm: (form) => set({ currentForm: form }),
  
  addElement: (element) => {
    const currentForm = get().currentForm;
    if (!currentForm) return;
    
    set({
      currentForm: {
        ...currentForm,
        elements: [...currentForm.elements, element]
      }
    });
  },
  
  removeElement: (elementId) => {
    const currentForm = get().currentForm;
    if (!currentForm) return;
    
    set({
      currentForm: {
        ...currentForm,
        elements: currentForm.elements.filter(el => el.id !== elementId)
      }
    });
  },
  
  updateElement: (elementId, element) => {
    const currentForm = get().currentForm;
    if (!currentForm) return;
    
    set({
      currentForm: {
        ...currentForm,
        elements: currentForm.elements.map(el => 
          el.id === elementId ? element : el
        )
      }
    });
  },
  
  reorderElements: (elements) => {
    const currentForm = get().currentForm;
    if (!currentForm) return;
    
    set({
      currentForm: {
        ...currentForm,
        elements
      }
    });
  },
}));