import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate: string;
    assignee?: { name: string; avatar: string };
    project?: { name: string };
  };
  onClick?: () => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div
      onClick={onClick}
      className="card p-4 cursor-pointer hover:scale-[1.02] transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-800 flex-1">{task.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </span>
          {isOverdue && <AlertCircle size={14} className="text-red-600" />}
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {task.status.replace('-', ' ')}
        </span>
      </div>
      
      {task.project && (
        <div className="mt-2 text-xs text-gray-500">
          Project: {task.project.name}
        </div>
      )}
      
      {task.assignee && (
        <div className="mt-2 flex items-center gap-2">
          <img
            src={task.assignee.avatar}
            alt={task.assignee.name}
            className="w-5 h-5 rounded-full"
          />
          <span className="text-xs text-gray-600">{task.assignee.name}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;