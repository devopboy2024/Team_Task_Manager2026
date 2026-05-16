import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { User, Mail, Camera, Save, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MemberProfile: React.FC = () => {
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    avatar: '',
    role: '',
    joinedAt: '',
  });
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      setProfile({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
        role: response.data.role,
        joinedAt: new Date(response.data.createdAt).toLocaleDateString(),
      });
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/tasks/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/users/${profile.id}`, {
        name: profile.name,
        email: profile.email,
      });
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
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
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500 mt-1">View your profile and performance stats</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full mx-auto"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full text-white">
                  <Camera size={16} />
                </button>
              </div>
              {editing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="input text-center"
                  />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="input text-center"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleUpdate} className="btn-primary flex-1">
                      Save
                    </button>
                    <button onClick={() => setEditing(false)} className="btn-secondary flex-1">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <p className="text-gray-500">{profile.email}</p>
                  <p className="text-sm capitalize text-primary-600 mt-1">{profile.role}</p>
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-primary w-full mt-4"
                  >
                    Edit Profile
                  </button>
                </>
              )}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">Member since {profile.joinedAt}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Tasks</p>
                    <p className="text-2xl font-bold">{stats.totalTasks}</p>
                  </div>
                  <TrendingUp size={32} className="text-primary-600" />
                </div>
              </div>
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
                  </div>
                  <CheckCircle size={32} className="text-green-600" />
                </div>
              </div>
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.inProgressTasks}</p>
                  </div>
                  <Clock size={32} className="text-blue-600" />
                </div>
              </div>
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Completion Rate</p>
                    <p className="text-2xl font-bold">
                      {stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-primary-600 flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Task Completion</span>
                    <span className="text-sm font-medium">
                      {stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${stats.totalTasks ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Productivity Score</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">On-Time Delivery</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MemberProfile;