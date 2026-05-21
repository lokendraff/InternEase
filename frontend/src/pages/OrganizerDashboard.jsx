import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, Columns3, BarChart3, LogOut,
  ChevronRight, ChevronLeft, Briefcase, Users, TrendingUp, Target,
} from 'lucide-react';
import API from '../utils/axios';
import toast from 'react-hot-toast';
import KanbanBoard from '../components/KanbanBoard';
import CreateJobForm from '../components/CreateJobForm';

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] },
});

/* ── Sidebar ── */
const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'create', label: 'Post Job', icon: PlusCircle },
  { id: 'kanban', label: 'Kanban Board', icon: Columns3 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

function Sidebar({ collapsed, toggle, user, onLogout, activeView, setView }) {
  const init = user?.name?.charAt(0)?.toUpperCase() || '?';
  return (
    <motion.aside animate={{ width: collapsed ? 76 : 264 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col shrink-0 h-screen bg-[#0c0c0c] border-r border-white/[0.06] overflow-hidden z-30">
      <div className="flex items-center justify-between px-5 pt-7 pb-6 border-b border-white/[0.06]" style={{ minHeight: 76 }}>
        {!collapsed && (
          <div className="flex items-center gap-0.5">
            <span className="font-display text-xl font-extrabold text-amber-50">Intern</span>
            <span className="font-display text-xl font-extrabold text-gold-bright">Ease</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 ml-0.5 mb-0.5" style={{ boxShadow: '0 0 8px #FBBF24' }} />
          </div>
        )}
        <button onClick={toggle} className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-white/[0.05] transition-all ml-auto">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="flex-1 px-4 py-7 space-y-2.5 overflow-y-auto">
        {NAV.map(n => {
          const Icon = n.icon; const on = activeView === n.id;
          return (
            <button key={n.id} onClick={() => setView(n.id)}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                ${on ? 'text-amber-400 bg-amber-500/[0.12] border border-amber-500/20' : 'text-gray-400 hover:text-amber-200 hover:bg-white/[0.04] border border-transparent'}`}>
              {on && <motion.div layoutId="org-nav-pill" className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-amber-400 rounded-r-full" style={{ boxShadow: '0 0 8px rgba(251,191,36,0.7)' }} />}
              <Icon size={18} className={on ? 'text-amber-400' : 'text-gray-500 group-hover:text-amber-300'} />
              {!collapsed && <span>{n.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="px-5 pb-7 border-t border-white/[0.05] pt-6">
        <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-obsidian shrink-0"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)', boxShadow: '0 0 12px rgba(251,191,36,0.4)' }}>{init}</div>
          {!collapsed && <div className="min-w-0"><p className="text-sm font-semibold text-amber-50 truncate">{user?.name}</p><p className="text-xs text-gray-500 capitalize">{user?.role}</p></div>}
        </div>
        <button onClick={onLogout} className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/[0.07] transition-all ${collapsed ? 'justify-center' : ''}`}>
          <LogOut size={15} />{!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}

/* ── Stat Card ── */
function StatCard({ title, value, icon: Icon, color, delay }) {
  return (
    <motion.div {...fadeUp(delay)} whileHover={{ y: -4 }}
      className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 flex flex-col gap-3 overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">{title}</p>
          <p className="text-3xl font-extrabold text-amber-50 leading-none">{value ?? '—'}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20"><Icon size={20} className="text-amber-400" /></div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}33 0%, transparent 70%)` }} />
    </motion.div>
  );
}

/* ── Simple Bar Chart ── */
function BarChartSimple({ data }) {
  const max = Math.max(...Object.values(data), 1);
  const colors = { Applied: '#3B82F6', 'In-Review': '#F59E0B', Interview: '#A855F7', Selected: '#10B981', Rejected: '#EF4444' };
  return (
    <div className="flex items-end gap-4 h-48">
      {Object.entries(data).map(([key, val]) => (
        <div key={key} className="flex-1 flex flex-col items-center gap-2">
          <span className="text-xs text-gray-400 font-bold">{val}</span>
          <motion.div initial={{ height: 0 }} animate={{ height: `${(val / max) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full rounded-t-lg min-h-[4px]" style={{ backgroundColor: colors[key] || '#FBBF24' }} />
          <span className="text-[10px] text-gray-500 font-medium text-center">{key}</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   Main Organizer Dashboard
   ══════════════════════════════════════════ */
export default function OrganizerDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState('overview');
  const [user, setUser] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'Organizer') { navigate('/dashboard'); return; }
    setUser(parsed);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, analyticsRes] = await Promise.all([
        API.get('/api/opportunities/organizer'),
        API.get('/api/analytics/organizer'),
      ]);
      setMyJobs(jobsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out');
    navigate('/login');
  };

  const selectedJob = myJobs.find(j => j._id === selectedJobId);

  return (
    <div className="flex min-h-screen bg-obsidian text-amber-50">
      <Sidebar collapsed={collapsed} toggle={() => setCollapsed(!collapsed)} user={user} onLogout={handleLogout} activeView={view} setView={setView} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 py-10">

          {/* Header */}
          <motion.div {...fadeUp(0)} className="mb-10">
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-amber-50">
              {view === 'overview' && 'Organizer Dashboard'}
              {view === 'create' && 'Post a New Opportunity'}
              {view === 'kanban' && 'Applicant Pipeline'}
              {view === 'analytics' && 'Recruitment Analytics'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name || 'Organizer'}.</p>
          </motion.div>

          {loading && view !== 'create' ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" /></div>
          ) : (
            <>
              {/* ─── Overview ─── */}
              {view === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <StatCard title="My Postings" value={analytics?.totalOpportunities} icon={Briefcase} color="#F59E0B" delay={0.1} />
                    <StatCard title="Total Applications" value={analytics?.totalApplications} icon={Users} color="#3B82F6" delay={0.15} />
                    <StatCard title="Avg ATS Score" value={`${analytics?.averageATS || 0}%`} icon={TrendingUp} color="#10B981" delay={0.2} />
                    <StatCard title="Selected" value={analytics?.breakdown?.Selected || 0} icon={Target} color="#A855F7" delay={0.25} />
                  </div>

                  {/* My Jobs List */}
                  <motion.div {...fadeUp(0.3)}>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">Your Job Postings</p>
                    {myJobs.length === 0 ? (
                      <div className="text-center py-12 text-gray-600">No postings yet. <button onClick={() => setView('create')} className="text-amber-400 underline underline-offset-4">Create your first one!</button></div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myJobs.map(job => (
                          <div key={job._id}
                            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:border-amber-500/20 transition-all cursor-pointer"
                            onClick={() => { setSelectedJobId(job._id); setView('kanban'); }}>
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-amber-50 text-sm">{job.title}</h4>
                                <p className="text-[11px] text-gray-500 mt-1">{job.type} · {job.status}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${job.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {job.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 line-clamp-2">{job.description}</p>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {job.skillsRequired?.slice(0, 4).map((s, i) => (
                                <span key={i} className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded text-[10px] text-gray-400">{s}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              )}

              {/* ─── Create Job ─── */}
              {view === 'create' && (
                <motion.div {...fadeUp(0.1)} className="max-w-2xl">
                  <CreateJobForm onCreated={() => { fetchData(); setView('overview'); }} />
                </motion.div>
              )}

              {/* ─── Kanban Board ─── */}
              {view === 'kanban' && (
                <motion.div {...fadeUp(0.1)}>
                  {/* Job Selector */}
                  <div className="mb-6">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Select Job Posting</label>
                    <select value={selectedJobId || ''} onChange={e => setSelectedJobId(e.target.value)}
                      className="bg-black/40 border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-amber-50 focus:outline-none focus:border-amber-500/50 w-full max-w-md">
                      <option value="">— Choose a job posting —</option>
                      {myJobs.map(j => <option key={j._id} value={j._id}>{j.title} ({j.status})</option>)}
                    </select>
                  </div>
                  <KanbanBoard opportunityId={selectedJobId} opportunityTitle={selectedJob?.title} />
                </motion.div>
              )}

              {/* ─── Analytics ─── */}
              {view === 'analytics' && analytics && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <StatCard title="My Postings" value={analytics.totalOpportunities} icon={Briefcase} color="#F59E0B" delay={0.1} />
                    <StatCard title="Total Applications" value={analytics.totalApplications} icon={Users} color="#3B82F6" delay={0.15} />
                    <StatCard title="Avg ATS Score" value={`${analytics.averageATS}%`} icon={TrendingUp} color="#10B981" delay={0.2} />
                    <StatCard title="Selected" value={analytics.breakdown?.Selected || 0} icon={Target} color="#A855F7" delay={0.25} />
                  </div>

                  <motion.div {...fadeUp(0.3)} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Application Status Breakdown</p>
                    {analytics.breakdown && <BarChartSimple data={analytics.breakdown} />}
                  </motion.div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
