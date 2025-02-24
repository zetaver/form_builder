import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useFormStore } from '../store/formStore';
import { FormElement } from '../types/form';
import { Toolbox } from './Toolbox';
import { PropertiesPanel } from './PropertiesPanel';
import { HelpCircle, X, ChevronLeft, Book, FileText, Lock, FileStack, ChevronDown, AlertCircle } from 'lucide-react';
import { DroppableArea } from './DroppableArea';
import { useNavigate, useParams } from 'react-router-dom';
import { ProfileMenu } from './ProfileMenu';

export const FormBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { formId } = useParams();
  const { 
    currentForm, 
    reorderElements, 
    createForm, 
    updateForm, 
    currentProject, 
    addElement,
    fetchForm,
    saveForm,
    isLoading,
    error: storeError
  } = useFormStore();
  const [activeElement, setActiveElement] = useState<FormElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<FormElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadForm = async () => {
      if (formId) {
        try {
          await fetchForm(formId);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to load form');
        }
      }
    };
    loadForm();
  }, [formId, fetchForm]);

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current) {
      setActiveElement(event.active.data.current as FormElement);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveElement(null);
    
    if (!over) return;

    if (active.id.toString().startsWith('toolbox-')) {
      const element = active.data.current as FormElement;
      const newElement = {
        ...element,
        id: `${element.type}_${Date.now()}`,
      };
      addElement(newElement);
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = currentForm!.elements.findIndex(el => el.id === active.id);
      const newIndex = currentForm!.elements.findIndex(el => el.id === over.id);
      reorderElements(arrayMove(currentForm!.elements, oldIndex, newIndex));
    }
  };

  const handleCancel = () => {
    if (currentProject) {
      navigate(`/project/${currentProject._id}`);
    } else {
      navigate('/home');
    }
  };

  const handleSaveForm = async () => {
    if (!currentForm) return;

    try {
      setIsSaving(true);
      setError(null);

      if (formId) {
        // Update existing form
        await saveForm(formId, {
          title: currentForm.title,
          name: currentForm.name,
          description: currentForm.description,
          elements: currentForm.elements
        });
      } else {
        // Create new form
        await createForm({
          title: currentForm.title,
          name: currentForm.name,
          description: currentForm.description,
          elements: currentForm.elements
        });
      }

      if (currentProject) {
        navigate(`/project/${currentProject._id}`);
      } else {
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save form');
    } finally {
      setIsSaving(false);
    }
  };

  const getApiEndpoint = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading form...</p>
      </div>
    );
  }

  if (!currentForm) return null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <div className="bg-[#1b2b3d] text-white">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center flex-1">
              <button 
                onClick={() => navigate(-1)}
                className="hover:bg-[#2d3d4f] p-4"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center">
                <button className="flex items-center gap-2 px-6 py-4 bg-[#2d3d4f]">
                  <FileText size={18} />
                  Forms
                </button>
                <button className="flex items-center gap-2 px-6 py-4 hover:bg-[#2d3d4f]">
                  <FileStack size={18} />
                  Report
                </button>
                <button className="flex items-center gap-2 px-6 py-4 hover:bg-[#2d3d4f]">
                  <Lock size={18} />
                  Access
                </button>
              </div>
            </div>
            <div className="flex items-center h-full">
              <button className="flex items-center gap-2 px-6 py-4 hover:bg-[#2d3d4f] h-full">
                <Book size={18} />
                Documentation
                <ChevronDown size={16} />
              </button>
              <div className="px-4">
                <ProfileMenu />
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Live stage:</span>
              <div className="px-2 py-0.5 bg-gray-100 rounded flex items-center gap-1 text-sm">
                <span>https://lptwkkfkcfun.zetaforms.io</span>
                <HelpCircle size={14} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Form Header Fields */}
          <div className="grid grid-cols-1 gap-6 p-6">
            {(error || storeError) && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2 text-red-700">
                <AlertCircle size={20} />
                <span>{error || storeError}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Path <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="bg-gray-50 px-3 py-2 text-gray-500 border border-r-0 border-gray-300 rounded-l">
                  https://lptwkkfkcfun.form.io/
                </div>
                <input
                  type="text"
                  value={getApiEndpoint(currentForm.title)}
                  readOnly
                  className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentForm.title}
                  onChange={(e) => updateForm({ ...currentForm, title: e.target.value })}
                  placeholder="Enter the form title"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentForm.name || ''}
                  onChange={(e) => updateForm({ ...currentForm, name: e.target.value })}
                  placeholder="Enter the form machine name"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <Toolbox />
          
          <div className="flex-1 overflow-y-auto">
            <DroppableArea 
              elements={currentForm.elements}
              onEdit={setSelectedElement}
            />
          </div>

          {selectedElement && (
            <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Element Properties</h2>
                <button
                  onClick={() => setSelectedElement(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <PropertiesPanel element={selectedElement} />
            </div>
          )}
        </div>

        {/* Form Action Buttons */}
        <div className="bg-white border-t border-gray-200 p-4 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveForm}
            disabled={isSaving || !currentForm.title || !currentForm.name}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving Form...' : formId ? 'Save Changes' : 'Create Form'}
          </button>
        </div>

        <DragOverlay>
          {activeElement && (
            <div className="bg-white rounded-lg shadow p-4 w-64 opacity-80">
              <div className="text-sm font-medium text-gray-900">{activeElement.label}</div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};