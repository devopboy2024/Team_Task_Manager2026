import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { FolderKanban, Calendar, Users } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  members: any[];
}

const MemberProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
          <p className="text-gray-500 mt-1">View projects you're participating in</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FolderKanban size={24} className="text-primary-600" />
                  <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' :
                  project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(project.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{project.members?.length || 0} members</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProject.name}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mb-4">{selectedProject.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${selectedProject.progress}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  <p>Start: {new Date(selectedProject.startDate).toLocaleDateString()}</p>
                  <p>End: {new Date(selectedProject.endDate).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Team Members</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.members?.map((member: any) => (
                      <div key={member.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                        <span className="text-sm">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MemberProjects;