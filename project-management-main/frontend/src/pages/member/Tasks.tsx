import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import TaskCard from '../../components/TaskCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MemberTasks: React.FC = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    'in-progress': [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      const allTasks = response.data.tasks || [];
      
      const grouped = {
        todo: allTasks.filter((t: any) => t.status === 'todo'),
        'in-progress': allTasks.filter((t: any) => t.status === 'in-progress'),
        completed: allTasks.filter((t: any) => t.status === 'completed'),
      };
      setTasks(grouped);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    // Optimistic update
    const sourceTasks = [...tasks[source.droppableId as keyof typeof tasks]];
    const destTasks = [...tasks[destination.droppableId as keyof typeof tasks]];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destTasks,
    });

    // Update backend
    try {
      await api.put(`/tasks/${draggableId}`, {
        status: destination.droppableId,
      });
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task status');
      fetchTasks(); // Revert on error
    }
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50' },
    { id: 'completed', title: 'Completed', color: 'bg-green-50' },
  ];

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
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <p className="text-gray-500 mt-1">Drag and drop tasks to update status</p>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <div key={column.id} className={`rounded-lg p-4 ${column.color}`}>
                <h2 className="text-lg font-semibold mb-4 px-2">{column.title}</h2>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[400px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-opacity-50 bg-gray-200' : ''
                      }`}
                    >
                      {tasks[column.id as keyof typeof tasks].map((task: any, index: number) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition-transform ${
                                snapshot.isDragging ? 'rotate-2 scale-105' : ''
                              }`}
                            >
                              <TaskCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </Layout>
  );
};

export default MemberTasks;