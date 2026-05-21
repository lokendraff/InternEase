import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, Save } from 'lucide-react';
import API from '../utils/axios';
import toast from 'react-hot-toast';

export default function ProfileSettingsModal({ isOpen, onClose, user, onUpdate }) {
  const [lcHandle, setLcHandle] = useState('');
  const [cfHandle, setCfHandle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.codingProfiles) {
      setLcHandle(user.codingProfiles.leetcodeHandle || '');
      setCfHandle(user.codingProfiles.codeforcesHandle || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put('/api/users/profile/handles', {
        leetcodeHandle: lcHandle,
        codeforcesHandle: cfHandle
      });
      toast.success('Coding handles updated! 🚀');
      onUpdate?.(); // Trigger a refetch
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update handles');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-black/40 border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-amber-50 focus:outline-none focus:border-amber-500/50 transition-colors placeholder-gray-600";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-obsidian border border-white/[0.1] rounded-3xl p-8 w-full max-w-md shadow-2xl z-10 flex flex-col gap-6">
            
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-amber-400 transition-colors">
              <X size={20} />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-amber-50 mb-1 flex items-center gap-2">
                <Code2 size={24} className="text-amber-400" /> Coding Profiles
              </h2>
              <p className="text-sm text-gray-400">Link your accounts to display live stats.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">LeetCode Username</label>
                <input value={lcHandle} onChange={e => setLcHandle(e.target.value)} placeholder="e.g. neetcode" className={inputCls} />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Codeforces Handle</label>
                <input value={cfHandle} onChange={e => setCfHandle(e.target.value)} placeholder="e.g. tourist" className={inputCls} />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-black bg-gold glow-gold disabled:opacity-50 transition-all">
                  {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><Save size={16} /> Save Changes</>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
