import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { User, Mail, Camera, Save } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    avatar: '',
    role: '',
    joinedAt: '',
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
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
          <p className="text-gray-500 mt-1">View and manage your profile information</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full mx-auto"
                />
                <button className="absolute bottom-0 right-0 p-1 bg-primary-600 rounded-full text-white">
                  <Camera size={16} />
                </button>
              </div>
              <h2 className="text-xl font-semibold mt-3">{profile.name}</h2>
              <p className="text-gray-500 capitalize">{profile.role}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="input"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <User size={18} className="text-gray-400" />
                    <span>{profile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                {editing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="input"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Mail size={18} className="text-gray-400" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span>{profile.joinedAt}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {editing ? (
                  <>
                    <button onClick={handleUpdate} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      <Save size={18} />
                      Save Changes
                    </button>
                    <button onClick={() => setEditing(false)} className="btn-secondary flex-1">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)} className="btn-primary w-full">
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminProfile;