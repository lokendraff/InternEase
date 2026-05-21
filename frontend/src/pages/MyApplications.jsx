import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, ShieldAlert, BrainCircuit, Briefcase } from 'lucide-react';
import API from '../utils/axios';
import toast from 'react-hot-toast';

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] },
});

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/applications/student')
      .then(res => setApplications(res.data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'In-Review': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Interview': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Selected': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-amber-50">
      <div className="max-w-6xl mx-auto p-8 lg:p-12">
        {/* Header */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-4 mb-12">
          <Link to="/dashboard" className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-amber-400 transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-amber-50 flex items-center gap-3">
              Application Tracker
            </h1>
            <p className="text-sm text-gray-500 mt-1">Track your progress and AI feedback for applied roles.</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" /></div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Briefcase size={40} className="mx-auto mb-4 text-gray-700" />
            <p>You haven't applied to any opportunities yet.</p>
            <Link to="/opportunities" className="inline-block mt-4 text-amber-400 hover:text-amber-300 underline underline-offset-4">Browse Opportunities</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app, i) => (
              <motion.div key={app._id} {...fadeUp(0.1 + i * 0.05)}
                className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden transition-all duration-300 hover:bg-white/[0.03]">
                
                {/* Left Side: Job Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-xl text-amber-50 mb-1">{app.opportunityId?.title || 'Unknown Opportunity'}</h3>
                  <p className="text-sm text-gray-400 mb-6">{app.opportunityId?.company || 'InternEase Platform'}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">ATS Score</span>
                      <span className={`text-2xl font-black ${app.atsScore >= 80 ? 'text-emerald-400' : app.atsScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                        {app.atsScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: AI Feedback */}
                <div className="flex-1 bg-amber-500/[0.03] border border-amber-500/[0.08] rounded-2xl p-6 relative">
                  <div className="absolute top-6 right-6">
                    <BrainCircuit size={20} className="text-amber-500/20" />
                  </div>
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ShieldAlert size={14} /> AI Analysis Feedback
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {app.aiFeedback || 'No feedback available for this application.'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
