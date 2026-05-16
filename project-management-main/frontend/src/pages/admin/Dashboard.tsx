import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import { 
  Users, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  TrendingUp,
  Activity,
  AlertCircle,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import api from '../../services/api';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface DashboardStats {
  totalProjects: number;
  totalMembers: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  inProgressTasks: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalMembers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    inProgressTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, usersRes, tasksRes, activitiesRes] = await Promise.all([
        api.get('/projects'),
        api.get('/users/members'),
        api.get('/tasks'),
        api.get('/users/activities'),
      ]);

      const tasks = tasksRes.data.tasks || [];
      const completed = tasks.filter((t: any) => t.status === 'completed').length;
      const pending = tasks.filter((t: any) => t.status === 'todo').length;
      const inProgress = tasks.filter((t: any) => t.status === 'in-progress').length;
      const overdue = tasks.filter((t: any) => 
        t.status !== 'completed' && new Date(t.dueDate) < new Date()
      ).length;

      setStats({
        totalProjects: projectsRes.data.length,
        totalMembers: usersRes.data.length,
        totalTasks: tasks.length,
        completedTasks: completed,
        pendingTasks: pending,
        overdueTasks: overdue,
        inProgressTasks: inProgress,
      });
      setRecentActivities(activitiesRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const lineChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [12, 19, 15, 27],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Tasks Created',
        data: [15, 22, 18, 30],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [stats.completedTasks, stats.inProgressTasks, stats.pendingTasks, stats.overdueTasks],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const barChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Productivity Score',
        data: [85, 88, 92, 90],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
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
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your projects.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={FolderKanban}
            color="bg-primary-600"
            trend={12}
          />
          <StatCard
            title="Team Members"
            value={stats.totalMembers}
            icon={Users}
            color="bg-blue-600"
            trend={8}
          />
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon={CheckSquare}
            color="bg-green-600"
            trend={15}
          />
          <StatCard
            title="Completed Tasks"
            value={stats.completedTasks}
            icon={TrendingUp}
            color="bg-purple-600"
            trend={23}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon={Clock}
            color="bg-yellow-600"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgressTasks}
            icon={Activity}
            color="bg-blue-600"
          />
          <StatCard
            title="Overdue Tasks"
            value={stats.overdueTasks}
            icon={AlertCircle}
            color="bg-red-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Completion Trend</h3>
            <Line data={lineChartData} options={{ responsive: true }} />
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Distribution</h3>
            <div className="w-64 mx-auto">
              <Doughnut data={doughnutChartData} options={{ responsive: true }} />
            </div>
          </div>
          
          <div className="card p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Productivity</h3>
            <Bar data={barChartData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.slice(0, 5).map((activity: any) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <img
                  src={activity.User?.avatar || 'https://ui-avatars.com/api/?background=6366f1&color=fff'}
                  alt={activity.User?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">{activity.User?.name}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;