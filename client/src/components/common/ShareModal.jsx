import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { axiosPrivate } from '../../api/axios';

export const ShareModal = ({ isOpen, onClose }) => {
  const [shareType, setShareType] = useState('snapshot'); // 'snapshot' or 'live'
  const [permission, setPermission] = useState('view');   // 'view' or 'edit'
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  // Enforce Snapshot logic (Snapshots must be view-only)
  useEffect(() => {
    if (shareType === 'snapshot') {
      setPermission('view');
    }
  }, [shareType]);

  // GSAP Entrance Animation
  useLayoutEffect(() => {
    if (isOpen) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(modalRef.current, 
        { scale: 0.95, opacity: 0, y: 20 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.5)" }
      );
    } else {
      // Reset state when closed
      setGeneratedLink('');
      setCopied(false);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerateLink = async () => {
    setLoading(true);
    setError('');
    setGeneratedLink('');
    setCopied(false);

    try {
      const response = await axiosPrivate.post('/share', {
        type: shareType,
        permission: permission
      });
      setGeneratedLink(response.data.shareUrl);
    } catch (err) {
      setError('Failed to generate link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Share Calendar</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        </header>

        {/* Body */}
        <div className="p-6 space-y-6">
          {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}

          {/* Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Share Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShareType('snapshot')}
                className={`p-3 border rounded-xl text-left transition-all ${shareType === 'snapshot' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
              >
                <div className="font-semibold text-gray-900 dark:text-white">Snapshot</div>
                <div className="text-xs text-gray-500 mt-1">Static copy of right now</div>
              </button>
              <button
                onClick={() => setShareType('live')}
                className={`p-3 border rounded-xl text-left transition-all ${shareType === 'live' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
              >
                <div className="font-semibold text-gray-900 dark:text-white">Live Sync</div>
                <div className="text-xs text-gray-500 mt-1">Updates in real-time</div>
              </button>
            </div>
          </div>

          {/* Permission Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Permissions</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="permission" 
                  value="view" 
                  checked={permission === 'view'}
                  onChange={(e) => setPermission(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-gray-700 dark:text-gray-300">View Only</span>
              </label>
              
              <label className={`flex items-center gap-2 ${shareType === 'snapshot' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <input 
                  type="radio" 
                  name="permission" 
                  value="edit" 
                  checked={permission === 'edit'}
                  onChange={(e) => setPermission(e.target.value)}
                  disabled={shareType === 'snapshot'}
                  className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-gray-700 dark:text-gray-300">Allow Editing</span>
              </label>
            </div>
          </div>

          {/* Generate Button / Result Link */}
          {!generatedLink ? (
            <button 
              onClick={handleGenerateLink}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex justify-center items-center h-12"
            >
              {loading ? 'Generating...' : 'Generate Share Link'}
            </button>
          ) : (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <label className="text-xs font-semibold text-gray-500 uppercase">Your secure link</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={generatedLink}
                  className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none"
                />
                <button 
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};