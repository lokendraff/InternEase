import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Globe, Clock, ExternalLink, Send, CheckCircle2, FileText, Search, Filter } from 'lucide-react';
import API from '../utils/axios';
import toast from 'react-hot-toast';

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] },
});

export default function Opportunities() {
  const [activeTab, setActiveTab] = useState('internal');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Apply Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobs(activeTab);
  }, [activeTab]);

  const fetchJobs = async (tab) => {
    setLoading(true);
    setJobs([]);
    try {
      const endpoint = tab === 'internal' ? '/api/opportunities' : '/api/opportunities/live';
      const { data } = await API.get(endpoint);
      setJobs(data);
    } catch (err) {
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return toast.error('Please paste your resume text to apply.');
    
    setApplying(true);
    try {
      await API.post('/api/applications', {
        opportunityId: selectedJob._id,
        resumeText: resumeText.trim()
      });
      toast.success('Successfully applied! +50 XP');
      setSelectedJob(null);
      setResumeText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply. You may have already applied.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-amber-50">
      <div className="max-w-6xl mx-auto p-8 lg:p-12">
        {/* Header */}
        <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-amber-400 transition-all">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-amber-50 flex items-center gap-3">
                Job Board <Briefcase size={24} className="text-amber-400" />
              </h1>
              <p className="text-sm text-gray-500 mt-1">Discover internal internships and live external roles.</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div {...fadeUp(0.1)} className="flex items-center gap-4 mb-8 border-b border-white/[0.08] pb-4">
          <button onClick={() => setActiveTab('internal')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'internal' ? 'bg-amber-500 text-obsidian shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'bg-white/[0.04] text-gray-400 hover:text-amber-200 hover:bg-white/[0.08]'}`}>
            Internal Roles
          </button>
          <button onClick={() => setActiveTab('external')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'external' ? 'bg-amber-500 text-obsidian shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'bg-white/[0.04] text-gray-400 hover:text-amber-200 hover:bg-white/[0.08]'}`}>
            Live External Jobs
          </button>
        </motion.div>

        {/* Job List */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" /></div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No opportunities found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobs.map((job, i) => (
              <motion.div key={job._id || i} {...fadeUp(0.1 + i * 0.05)}
                className="bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/30 hover:bg-white/[0.04] rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-300">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-amber-50 text-lg leading-tight mb-1">{job.title}</h3>
                    <p className="text-xs text-gray-400">{job.company || (job.organizerId?.name || 'InternEase Partner')}</p>
                  </div>
                  {job.isExternal ? (
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0"><Globe size={16} /></div>
                  ) : (
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0"><CheckCircle2 size={16} /></div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed flex-1">
                  {job.description || 'No description provided.'}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skillsRequired?.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white/[0.05] border border-white/[0.08] rounded-md text-[10px] text-gray-400 uppercase tracking-wider">{skill}</span>
                  ))}
                  {job.location && (
                    <span className="px-2 py-1 bg-white/[0.05] border border-white/[0.08] rounded-md text-[10px] text-gray-400 uppercase tracking-wider">{job.location}</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Clock size={14} className="text-gray-600" /> {job.type || 'Full-time'}
                  </span>
                  
                  {job.isExternal ? (
                    <a href={job.applyLink || '#'} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-lg text-xs font-bold transition-all">
                      Apply Ext <ExternalLink size={12} />
                    </a>
                  ) : (
                    <button onClick={() => setSelectedJob(job)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-obsidian rounded-lg text-xs font-bold transition-all shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                      Quick Apply <Send size={12} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Apply Modal */}
        <AnimatePresence>
          {selectedJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedJob(null)} />
              
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-obsidian border border-white/[0.1] rounded-3xl p-8 w-full max-w-lg shadow-2xl z-10 flex flex-col gap-6">
                
                <div>
                  <h2 className="text-2xl font-bold text-amber-50 mb-1">Apply for Role</h2>
                  <p className="text-sm text-gray-400">You are applying for <span className="text-amber-400 font-bold">{selectedJob.title}</span></p>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    <FileText size={14} className="text-amber-400" /> Paste Resume Text
                  </label>
                  <textarea rows={6} value={resumeText} onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste the raw text of your resume here. Our AI will analyze it against the job description for ATS scoring."
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl p-4 text-amber-50 text-sm resize-none focus:outline-none focus:border-amber-500/50 transition-colors placeholder-gray-600" />
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setSelectedJob(null)}
                    className="flex-1 py-3.5 rounded-xl font-bold text-sm text-gray-400 bg-white/[0.05] hover:bg-white/[0.1] transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleApply} disabled={applying}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-obsidian bg-gold glow-gold disabled:opacity-50 transition-all">
                    {applying ? <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" /> : <><Send size={16} /> Submit Application</>}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
