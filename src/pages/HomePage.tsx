import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, HelpCircle, Settings, FileText, ExternalLink } from 'lucide-react';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { useFormStore } from '../store/formStore';
import { ProfileMenu } from '../components/ProfileMenu';

export const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { projects } = useFormStore();
  const navigate = useNavigate();

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
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <span>+</span> Create Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span className="px-2 py-0.5 bg-gray-100 rounded">Trial</span>
              </div>
              <p className="text-gray-600 text-sm">{project.description || 'No description'}</p>
              <div className="mt-4 text-xs text-gray-400">
                Updated {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">No projects found. Create a new project to get started!</p>
            </div>
          )}
        </div>
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};