import { useState, useEffect, useCallback } from 'react';
import { axiosPrivate } from '../api/axios';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get('/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load library tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData) => {
    try {
      const response = await axiosPrivate.post('/tasks', taskData);
      setTasks(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axiosPrivate.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      throw new Error('Failed to delete task');
    }
  };
  const updateTask = async (id, updates) => {
    try {
      const response = await axiosPrivate.put(`/tasks/${id}`, updates);
      setTasks(prev => prev.map(t => t._id === id ? response.data : t));
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  return { tasks, loading, error, addTask, deleteTask, updateTask, refetch: fetchTasks };
};