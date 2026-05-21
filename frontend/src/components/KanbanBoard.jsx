import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, User, Star, ChevronDown } from 'lucide-react';
import API from '../utils/axios';
import toast from 'react-hot-toast';

const COLUMNS = ['Applied', 'In-Review', 'Interview', 'Selected', 'Rejected'];
const COL_COLORS = {
  'Applied': { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' },
  'In-Review': { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
  'Interview': { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-400' },
  'Selected': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'Rejected': { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
};

function AppCard({ app, onMove }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 cursor-default hover:border-amber-500/20 transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-[10px] font-bold text-black">
            {app.studentId?.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-50">{app.studentId?.name || 'Unknown'}</p>
            <p className="text-[10px] text-gray-500">{app.studentId?.email}</p>
          </div>
        </div>
        <GripVertical size={14} className="text-gray-600 shrink-0 mt-1" />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Star size={12} className="text-amber-400" />
        <span className={`text-xs font-bold ${app.atsScore >= 70 ? 'text-emerald-400' : app.atsScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
          ATS: {app.atsScore ?? 'N/A'}%
        </span>
      </div>
      {/* Move dropdown */}
      <div className="relative">
        <button onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-gray-400 hover:text-amber-300 transition-colors">
          Move to... <ChevronDown size={12} />
        </button>
        {open && (
          <div className="absolute bottom-full left-0 w-full mb-1 bg-[#141414] border border-white/[0.1] rounded-lg overflow-hidden z-20 shadow-2xl">
            {COLUMNS.filter(c => c !== app.status).map(col => (
              <button key={col} onClick={() => { onMove(app._id, col); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-[11px] font-medium hover:bg-white/[0.06] transition-colors ${COL_COLORS[col].text}`}>
                {col}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function KanbanBoard({ opportunityId, opportunityTitle }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!opportunityId) return;
    setLoading(true);
    API.get(`/api/applications/opportunity/${opportunityId}`)
      .then(res => setApps(res.data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, [opportunityId]);

  const handleMove = async (appId, newStatus) => {
    try {
      await API.patch(`/api/applications/${appId}/status`, { status: newStatus });
      setApps(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
      toast.success(`Moved to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (!opportunityId) {
    return <div className="text-center py-20 text-gray-500">Select a job posting above to view its applicant pipeline.</div>;
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mb-6">Pipeline for: <span className="text-amber-400 font-bold">{opportunityTitle}</span></p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map(col => {
          const colApps = apps.filter(a => a.status === col);
          const c = COL_COLORS[col];
          return (
            <div key={col} className={`${c.bg} border ${c.border} rounded-2xl p-4 min-h-[300px]`}>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
                <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${c.text}`}>{col}</span>
                <span className="ml-auto text-[10px] text-gray-500 font-bold bg-white/[0.06] px-2 py-0.5 rounded-full">{colApps.length}</span>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {colApps.map(app => <AppCard key={app._id} app={app} onMove={handleMove} />)}
                </AnimatePresence>
                {colApps.length === 0 && <p className="text-center text-[11px] text-gray-600 py-8">No applicants</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
