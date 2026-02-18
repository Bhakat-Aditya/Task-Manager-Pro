import { useState } from 'react';

export const CreateTaskModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, defaultDescription: description, color: '#3b82f6' });
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4 dark:text-white">Create Blueprint</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400">Task Title</label>
            <input 
              autoFocus
              type="text" value={title} onChange={e => setTitle(e.target.value)} required
              className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400">Description</label>
            <textarea 
              value={description} onChange={e => setDescription(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};