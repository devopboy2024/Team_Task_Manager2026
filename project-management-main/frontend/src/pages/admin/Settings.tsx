import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Save, Bell, Shield, User, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminSettings: React.FC = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskAssigned: true,
    taskDue: true,
    projectUpdates: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      setProfile({
        ...profile,
        name: response.data.name,
        email: response.data.email,
      });
    } catch (error) {
      console.error('Failed to load profile');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/users/${await getUserId()}`, {
        name: profile.name,
        email: profile.email,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.newPassword !== profile.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await api.put(`/users/${await getUserId()}`, {
        password: profile.newPassword,
      });
      toast.success('Password updated successfully');
      setProfile({ ...profile, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to update password');
    }
  };

  const getUserId = async () => {
    const response = await api.get('/auth/me');
    return response.data.id;
  };

  const handleNotificationUpdate = () => {
    toast.success('Notification settings saved');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
            </div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="input"
                />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Save size={18} />
                Update Profile
              </button>
            </form>
          </div>

          {/* Password Settings */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} className="text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-800">Password</h2>
            </div>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={profile.newPassword}
                  onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={profile.confirmPassword}
                  onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                  className="input"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Update Password
              </button>
            </form>
          </div>

          {/* Notification Settings */}
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={20} className="text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">Email Notifications</span>
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                  className="toggle"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">Task Assigned</span>
                <input
                  type="checkbox"
                  checked={notifications.taskAssigned}
                  onChange={(e) => setNotifications({ ...notifications, taskAssigned: e.target.checked })}
                  className="toggle"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">Task Due Reminders</span>
                <input
                  type="checkbox"
                  checked={notifications.taskDue}
                  onChange={(e) => setNotifications({ ...notifications, taskDue: e.target.checked })}
                  className="toggle"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">Project Updates</span>
                <input
                  type="checkbox"
                  checked={notifications.projectUpdates}
                  onChange={(e) => setNotifications({ ...notifications, projectUpdates: e.target.checked })}
                  className="toggle"
                />
              </label>
            </div>
            <button onClick={handleNotificationUpdate} className="btn-primary w-full mt-4">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminSettings;