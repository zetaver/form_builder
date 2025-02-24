import React, { useState, useEffect } from 'react';
import { Plus, Search, UserPlus, Settings, MoreVertical, AlertCircle } from 'lucide-react';
import { useTeamStore } from '../store/teamStore';

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

export const TeamsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { teams, fetchTeams, isLoading } = useTeamStore();

  useEffect(() => {
    const loadTeams = async () => {
      try {
        await fetchTeams();
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load teams');
      }
    };
    loadTeams();
  }, [fetchTeams]);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Teams</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Create Team
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading teams...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{team.description || 'No description'}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Team Members</h4>
                    <button className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
                      <UserPlus size={16} />
                      Invite
                    </button>
                  </div>
                  <div className="space-y-2">
                    {team.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-600">
                                {member.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Created {new Date(team.createdAt).toLocaleDateString()}
                    </span>
                    <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                      <Settings size={16} />
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTeams.length === 0 && !error && !isLoading && (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No teams found. Create a new team to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};