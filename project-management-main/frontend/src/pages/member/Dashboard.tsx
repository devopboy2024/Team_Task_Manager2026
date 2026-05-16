import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import TaskCard from '../../components/TaskCard';
import { CheckSquare, Clock, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MemberDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    assignedTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    todayTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const tasksRes = await api.get('/tasks');
      const tasks = tasksRes.data.tasks || [];
      
      const completed = tasks.filter((t: any) => t.status === 'completed').length;
      const pending = tasks.filter((t: any) => t.status === 'todo').length;
      const overdue = tasks.filter((t: any) => 
        t.status !== 'completed' && new Date(t.dueDate) < new Date()
      ).length;
      const today = tasks.filter((t: any) => {
        const todayDate = new Date().toDateString();
        const dueDate = new Date(t.dueDate).toDateString();
        return dueDate === todayDate && t.status !== 'completed';
      }).length;

      setStats({
        assignedTasks: tasks.length,
        completedTasks: completed,
        pendingTasks: pending,
        overdueTasks: overdue,
        todayTasks: today,
      });
      setRecentTasks(tasks.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
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
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your tasks and productivity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Assigned Tasks"
            value={stats.assignedTasks}
            icon={CheckSquare}
            color="bg-primary-600"
          />
          <StatCard
            title="Completed"
            value={stats.completedTasks}
            icon={TrendingUp}
            color="bg-green-600"
          />
          <StatCard
            title="In Progress"
            value={stats.pendingTasks}
            icon={Clock}
            color="bg-yellow-600"
          />
          <StatCard
            title="Overdue"
            value={stats.overdueTasks}
            icon={AlertCircle}
            color="bg-red-600"
          />
          <StatCard
            title="Today's Tasks"
            value={stats.todayTasks}
            icon={Calendar}
            color="bg-blue-600"
          />
        </div>

        {/* Recent Tasks */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Tasks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTasks.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Overall Completion</span>
                <span className="text-sm font-medium text-gray-800">
                  {stats.assignedTasks ? Math.round((stats.completedTasks / stats.assignedTasks) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.assignedTasks ? Math.round((stats.completedTasks / stats.assignedTasks) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MemberDashboard;