import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, HelpCircle, Settings, FileText, ExternalLink, AlertCircle, Pencil, Trash2 } from 'lucide-react';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { EditProjectModal } from '../components/EditProjectModal';
import { useFormStore } from '../store/formStore';
import { ProfileMenu } from '../components/ProfileMenu';
import { Project } from '../types/form';

export const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { projects, fetchProjects, isLoading, deleteProject } = useFormStore();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        await fetchProjects();
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load projects. Please try again.');
      }
    };
    loadProjects();
  }, [fetchProjects]);

  const handleEditProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projectId);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete project. Please try again.');
      }
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            Projects <HelpCircle size={16} className="text-gray-400" />
          </h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">
              <Settings size={20} />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <FileText size={20} />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <ExternalLink size={20} />
            </button>
            <ProfileMenu />
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Find a project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <span>+</span> Create Project
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading projects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <span className="px-2 py-0.5 bg-gray-100 rounded">Trial</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditProject(project, e)}
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Edit project"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(project._id, e)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{project.description || 'No description'}</p>
                <div className="mt-4 text-xs text-gray-400">
                  Updated {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}

            {filteredProjects.length === 0 && !error && !isLoading && (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No projects found. Create a new project to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedProject && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
        />
      )}
    </div>
  );
};