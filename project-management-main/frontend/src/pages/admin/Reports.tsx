import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { BarChart3, Download, Calendar, Filter } from 'lucide-react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminReports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
        api.get('/users'),
      ]);
      
      const tasks = tasksRes.data.tasks || [];
      const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
      const overdueTasks = tasks.filter((t: any) => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length;
      
      setReportData({
        totalTasks: tasks.length,
        completedTasks,
        completionRate: tasks.length ? (completedTasks / tasks.length * 100).toFixed(1) : 0,
        overdueTasks,
        totalProjects: projectsRes.data.length,
        totalMembers: usersRes.data.length,
      });
    } catch (error) {
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [12, 19, 15, 27, 22, 8, 5],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
      {
        label: 'Tasks Created',
        data: [15, 22, 18, 30, 25, 10, 3],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  };

  const pieChartData = {
    labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [reportData?.completedTasks || 0, 15, 20, reportData?.overdueTasks || 0],
        backgroundColor: ['#22c55e', '#3b82f6', '#eab308', '#ef4444'],
      },
    ],
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-500 mt-1">View detailed analytics and insights</p>
          </div>
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input w-32"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="btn-secondary flex items-center gap-2">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-800">{reportData?.totalTasks}</p>
            <p className="text-sm text-green-600 mt-2">+12% from last month</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-500">Completion Rate</p>
            <p className="text-3xl font-bold text-gray-800">{reportData?.completionRate}%</p>
            <p className="text-sm text-green-600 mt-2">+5% from last month</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-500">Total Projects</p>
            <p className="text-3xl font-bold text-gray-800">{reportData?.totalProjects}</p>
            <p className="text-sm text-blue-600 mt-2">Active projects</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-500">Team Members</p>
            <p className="text-3xl font-bold text-gray-800">{reportData?.totalMembers}</p>
            <p className="text-sm text-blue-600 mt-2">Active members</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Activity</h3>
            <Bar data={barChartData} options={{ responsive: true }} />
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Distribution</h3>
            <div className="w-64 mx-auto">
              <Pie data={pieChartData} options={{ responsive: true }} />
            </div>
          </div>
        </div>

        {/* Productivity Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Productivity Trends</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Team Productivity</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">On-Time Delivery</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Task Quality Score</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminReports;