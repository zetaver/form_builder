import { create } from 'zustand';
import { FormElement, Form, Project } from '../types/form';
import { persist } from 'zustand/middleware';

interface FormStore {
  projects: Project[];
  forms: Form[];
  currentProject: Project | null;
  currentForm: Form | null;
  setCurrentForm: (form: Form | null) => void;
  updateForm: (form: Form) => void;
  addElement: (element: FormElement) => void;
  removeElement: (elementId: string) => void;
  updateElement: (elementId: string, element: FormElement) => void;
  reorderElements: (elements: FormElement[]) => void;
  createProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  setCurrentProject: (projectId: string) => void;
  createForm: (form: Omit<Form, 'id' | 'projectId' | 'createdAt'>) => Form | null;
  deleteForm: (formId: string) => void;
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      projects: [],
      forms: [],
      currentProject: null,
      currentForm: null,

      createProject: (project) => {
        const newProject: Project = {
          id: crypto.randomUUID(),
          ...project,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
        }));
        return newProject;
      },

      setCurrentProject: (projectId) => {
        const project = get().projects.find((p) => p.id === projectId);
        set({ currentProject: project || null });
      },

      createForm: (form) => {
        const currentProject = get().currentProject;
        if (!currentProject) return null;

        const newForm: Form = {
          id: crypto.randomUUID(),
          projectId: currentProject.id,
          ...form,
          createdAt: new Date().toISOString(),
          elements: [],
        };

        set((state) => ({
          forms: [...state.forms, newForm],
          currentForm: newForm,
        }));
        return newForm;
      },

      deleteForm: (formId) => {
        set((state) => ({
          forms: state.forms.filter(form => form.id !== formId),
          currentForm: state.currentForm?.id === formId ? null : state.currentForm,
        }));
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
    }),
    {
      name: 'form-builder-storage',
    }
  )
);