import { useState, useEffect, useCallback } from 'react';
import { axiosPrivate } from '../api/axios';

export const useCalendar = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get('/calendar');
      setEntries(response.data);
    } catch (err) {
      console.error('Failed to load calendar entries', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const addEntryToDate = async (blueprintId, targetDate, timeOfDay = 'Any') => {
    try {
      const response = await axiosPrivate.post('/calendar', { blueprintId, date: targetDate, timeOfDay });
      setEntries(prev => [...prev, response.data]);
    } catch (err) {
      console.error('Failed to place task', err);
    }
  };

  const updateEntry = async (id, updates) => {
    try {
      const response = await axiosPrivate.put(`/calendar/${id}`, updates);
      setEntries(prev => prev.map(entry => entry._id === id ? response.data : entry));
    } catch (err) {
      console.error('Failed to update entry', err);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axiosPrivate.delete(`/calendar/${id}`);
      setEntries(prev => prev.filter(entry => entry._id !== id));
    } catch (err) {
      console.error('Failed to delete entry', err);
    }
  };

  // NEW: Filter by Year and Month as well as Date
  const getEntriesByDate = (year, month, dateNum) => {
    return entries.filter(entry => {
      const d = new Date(entry.date);
      return d.getUTCFullYear() === year && d.getUTCMonth() === month && d.getUTCDate() === dateNum;
    });
  };

  return { entries, loading, getEntriesByDate, addEntryToDate, updateEntry, deleteEntry, refetch: fetchEntries };
};