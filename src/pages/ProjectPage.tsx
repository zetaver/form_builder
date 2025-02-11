import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, HelpCircle, Plus, Trash2 } from 'lucide-react';
import { useFormStore } from '../store/formStore';

export const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { projects, forms, currentProject, setCurrentProject, createForm, deleteForm } = useFormStore();

  React.useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId]);

  const projectForms = forms.filter(form => form.projectId === projectId);

  const handleCreateForm = () => {
    const newForm = createForm({
      title: 'New Form',
      description: '',
    });
    if (newForm) {
      navigate(`/form/${newForm.id}`);
    }
  };

  const handleDeleteForm = (formId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    if (window.confirm('Are you sure you want to delete this form?')) {
      deleteForm(formId);
    }
  };

  if (!currentProject) return null;

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

        <div className="space-y-4">
          {projectForms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-green-600 hover:text-green-700 cursor-pointer"
                      onClick={() => navigate(`/form/${form.id}`)}>
                    {form.title}
                  </h3>
                  <div className="text-sm text-gray-500 mt-1">
                    More info...
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Updated {new Date(form.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                    Launch
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    Copy
                  </button>
                  <button
                    onClick={(e) => handleDeleteForm(form.id, e)}
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
        </div>
      </div>
    </div>
  );
};