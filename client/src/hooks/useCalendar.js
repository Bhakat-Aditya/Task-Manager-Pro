import { useState, useEffect, useCallback } from 'react';
import { axiosPrivate } from '../api/axios';

export const useCalendar = () => {
  const [entries, setEntries] = useState([]); // Array of all calendar entries
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

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Fired when an item is dropped from the Library to a Day
  const addEntryToDate = async (blueprintId, targetDate) => {
    try {
      // Optimistic UI update could go here, but for simplicity we'll await the DB
      const response = await axiosPrivate.post('/calendar', {
        blueprintId,
        date: targetDate, // e.g., "2026-02-15T00:00:00.000Z"
      });
      setEntries(prev => [...prev, response.data]);
    } catch (err) {
      console.error('Failed to place task on calendar', err);
    }
  };

  // Group entries by date for the UI grid mapping
  const getEntriesByDate = (dateNum) => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getUTCDate() === dateNum;
    });
  };

  return { entries, loading, getEntriesByDate, addEntryToDate, refetch: fetchEntries };
};