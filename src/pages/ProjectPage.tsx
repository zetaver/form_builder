import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, HelpCircle, Plus, Trash2, AlertCircle, Code } from 'lucide-react';
import { useFormStore } from '../store/formStore';
import { FormRenderer } from '../components/FormRenderer';
import { EmbedCodeModal } from '../components/EmbedCodeModal';
import { Form } from '../types/form';

export const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const { 
    projects, 
    forms, 
    currentProject, 
    setCurrentProject, 
    setCurrentForm, 
    deleteForm,
    fetchProjectForms,
    isLoading,
    error: storeError,
  } = useFormStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
      fetchProjectForms(projectId).catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch forms');
      });
    }
  }, [projectId, setCurrentProject, fetchProjectForms]);

  const handleCreateForm = () => {
    setCurrentForm({
      _id: crypto.randomUUID(),
      projectId: projectId!,
      title: '',
      name: '',
      description: '',
      elements: [],
      createdAt: new Date().toISOString(),
      endpoint: ''
    });
    navigate(`/form/${projectId}`);
  };

  const handleDeleteForm = async (formId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (window.confirm('Are you sure you want to delete this form?')) {
        await deleteForm(formId);
        setError(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete form');
    }
  };

  const handleLaunchForm = (form: Form, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForm(form);
  };

  const handleShowEmbedCode = (form: Form, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForm(form);
    setShowEmbedModal(true);
  };

  if (!currentProject) return null;

  const filteredForms = forms.filter(form => 
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Live stage:</span>
            <div className="px-2 py-0.5 bg-gray-100 rounded-md flex items-center gap-1">
              <span>https://lptwkkfkcfun.form.io</span>
              <button className="text-gray-400 hover:text-gray-600">
                <HelpCircle size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            Forms <HelpCircle size={16} className="text-gray-400" />
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateForm}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <Plus size={20} /> New Form
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {(error || storeError) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span>{error || storeError}</span>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              Filter by tag
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading forms...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredForms.map((form) => (
              <div
                key={form._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-green-600 hover:text-green-700 cursor-pointer"
                        onClick={() => navigate(`/form/${form._id}`)}>
                      {form.title}
                    </h3>
                    <div className="text-sm text-gray-500 mt-1">
                      {form.description || 'No description'}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Updated {new Date(form.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleLaunchForm(form, e)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Launch
                    </button>
                    <button 
                      onClick={(e) => handleShowEmbedCode(form, e)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
                    >
                      <Code size={16} />
                      Embed
                    </button>
                    <button
                      onClick={(e) => handleDeleteForm(form._id, e)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete form"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <HelpCircle size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredForms.length === 0 && !error && !isLoading && (
              <div className="text-center py-8">
                <p className="text-gray-500">No forms found. Create your first form to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Launch Modal */}
      {selectedForm && !showEmbedModal && (
        <FormRenderer
          form={selectedForm}
          onClose={() => setSelectedForm(null)}
        />
      )}

      {/* Embed Code Modal */}
      {selectedForm && showEmbedModal && (
        <EmbedCodeModal
          form={selectedForm}
          isOpen={showEmbedModal}
          onClose={() => {
            setShowEmbedModal(false);
            setSelectedForm(null);
          }}
        />
      )}
    </div>
  );
};