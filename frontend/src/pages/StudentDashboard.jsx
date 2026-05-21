import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Mic, Briefcase, Trophy, LogOut,
  ChevronRight, ChevronLeft, Star, TrendingUp, Code2, Upload, Play,
  Globe, Building2, Clock, ExternalLink, Menu, X, Users, Zap,
} from 'lucide-react';
import API from '../utils/axios';
import toast from 'react-hot-toast';

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] },
});

/* ── Sidebar ── */
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'resume', label: 'AI Resume', icon: FileText, path: '/resume-analyzer' },
  { id: 'interview', label: 'Mock Interviews', icon: Mic, path: '/mock-interview' },
  { id: 'jobs', label: 'Live Jobs', icon: Briefcase, path: '/dashboard' },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
];

function Sidebar({ collapsed, toggle, user, onLogout }) {
  const location = useLocation();
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
          const Icon = n.icon; const on = location.pathname === n.path || (location.pathname === '/' && n.id === 'dashboard');
          return (
            <Link key={n.id} to={n.path}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                ${on ? 'text-amber-400 bg-amber-500/[0.12] border border-amber-500/20' : 'text-gray-400 hover:text-amber-200 hover:bg-white/[0.04] border border-transparent'}`}>
              {on && <motion.div layoutId="nav-pill" className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-amber-400 rounded-r-full" style={{ boxShadow: '0 0 8px rgba(251,191,36,0.7)' }} />}
              <Icon size={18} className={on ? 'text-amber-400' : 'text-gray-500 group-hover:text-amber-300'} />
              {!collapsed && <span>{n.label}</span>}
            </Link>
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

/* ── XP Bar ── */
function XPBar({ current, max }) {
  const pct = max > 0 ? (current / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-amber-400 font-bold whitespace-nowrap">{current} XP</span>
      <div className="relative flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden" style={{ minWidth: 100 }}>
        <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ background: 'linear-gradient(90deg, #D97706, #FBBF24, #FDE68A)' }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} />
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{max} XP</span>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ title, value, sub, icon: Icon, color, delay }) {
  return (
    <motion.div {...fadeUp(delay)}
      whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(251,191,36,0.12), 0 0 0 1px rgba(251,191,36,0.15)' }}
      className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 flex flex-col gap-4 overflow-hidden cursor-default transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">{title}</p>
          <p className="text-3xl font-extrabold text-amber-50 leading-none">{value ?? '—'}</p>
          <p className="text-xs text-gray-500 mt-2">{sub}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20"><Icon size={20} className="text-amber-400" /></div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}33 0%, transparent 70%)` }} />
    </motion.div>
  );
}

/* ── Resume Card ── */
function ResumeCard() {
  return (
    <motion.div {...fadeUp(0.25)} whileHover={{ y: -4 }}
      className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-10 flex flex-col gap-8 relative overflow-hidden transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div><p className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-1.5">AI Tool</p>
          <h3 className="text-xl font-bold text-amber-50">Resume Analyzer</h3>
          <p className="text-sm text-gray-400 mt-2">Real-time ATS optimization powered by Gemini.</p></div>
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"><FileText size={22} className="text-amber-400" /></div>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">Upload your resume to get an AI-powered ATS score, keyword analysis, and actionable formatting tips.</p>
      <Link to="/resume-analyzer">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="group relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-black overflow-hidden cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }}>
          <Upload size={16} /><span>Upload & Analyze Resume</span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ── Interview Card ── */
function InterviewCard() {
  return (
    <motion.div {...fadeUp(0.32)} whileHover={{ y: -4 }}
      className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-10 flex flex-col gap-8 relative overflow-hidden transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div><p className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-1.5">AI Tool</p>
          <h3 className="text-xl font-bold text-amber-50">Mock Interview Engine</h3>
          <p className="text-sm text-gray-400 mt-2">Adaptive technical + behavioral simulations.</p></div>
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"><Mic size={22} className="text-amber-400" /></div>
      </div>
      <div className="flex items-center justify-center gap-6 py-4">
        <span className="flex items-center gap-1.5 text-xs text-gray-500"><Code2 size={14} className="text-amber-400" /> Technical</span>
        <span className="text-white/20">|</span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500"><Users size={14} className="text-amber-400" /> Behavioral</span>
        <span className="text-white/20">|</span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500"><Zap size={14} className="text-amber-400" /> Adaptive</span>
      </div>
      <Link to="/mock-interview" className="block w-full">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="group relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-black overflow-hidden cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)', boxShadow: '0 0 15px rgba(245,158,11,0.4)' }}>
          <Play size={15} className="fill-black" /><span>Start Interview</span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ── Job Card ── */
function JobCard({ job, delay }) {
  return (
    <motion.div {...fadeUp(delay)} whileHover={{ y: -5 }}
      className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 flex flex-col gap-5 relative overflow-hidden transition-shadow duration-300">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
          <Building2 size={20} className="text-amber-400" />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-amber-50 text-base truncate">{job.title}</h4>
          <p className="text-xs text-gray-400 mt-1">{job.company}</p>
        </div>
      </div>
      {job.description && <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{job.description}</p>}
      <div className="flex flex-wrap gap-2.5">
        {job.location && (
          <span className="flex items-center gap-1 text-[11px] text-gray-400 bg-white/[0.05] border border-white/[0.07] px-2.5 py-1 rounded-full">
            <Globe size={10} /> {job.location}
          </span>
        )}
        {job.isExternal && <span className="text-[11px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">External</span>}
      </div>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.06]">
        <span className="flex items-center gap-1 text-xs text-gray-500"><Clock size={11} /> Apply soon</span>
        <motion.a href={job.applyLink || '#'} target="_blank" rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg transition-colors"
          style={{ boxShadow: '0 0 12px rgba(251,191,36,0.3)' }}>
          Apply <ExternalLink size={11} />
        </motion.a>
      </div>
    </motion.div>
  );
}

/* ── Loading Spinner ── */
function Spinner() {
  return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" /></div>;
}

/* ══════════════════════════════════════════
   Student Dashboard — 100% Backend Driven
   ══════════════════════════════════════════ */
export default function StudentDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const navigate = useNavigate();

  const stored = localStorage.getItem('user');
  const cachedUser = stored ? JSON.parse(stored) : { name: 'Student', role: 'Student' };

  useEffect(() => {
    API.get('/api/users/profile')
      .then(r => setProfile(r.data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoadingProfile(false));

    API.get('/api/opportunities/live')
      .then(r => { if (Array.isArray(r.data)) setJobs(r.data); })
      .catch(() => toast.error('Failed to load opportunities'))
      .finally(() => setLoadingJobs(false));
  }, []);

  const user = profile || cachedUser;
  const lc = profile?.liveStats?.leetcode || {};
  const cf = profile?.liveStats?.codeforces || {};
  const xp = profile?.xp ?? 0;
  const badges = profile?.badges || [];

  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };

  return (
    <div className="flex h-screen bg-obsidian overflow-hidden text-amber-50">
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar collapsed={collapsed} toggle={() => setCollapsed(c => !c)} user={user} onLogout={logout} />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
          <Sidebar collapsed={false} toggle={() => {}} user={user} onLogout={logout} />
          <button className="absolute top-5 right-[-48px] w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white" onClick={() => setMobileOpen(false)}><X size={16} /></button>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden shrink-0 flex items-center px-6 py-4 border-b border-white/[0.06] bg-obsidian/80 backdrop-blur-md">
          <button className="p-2 rounded-lg text-gray-400 hover:text-amber-400 transition" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <span className="ml-4 font-display text-lg font-extrabold text-amber-50">Intern<span className="text-gold-bright">Ease</span></span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">

          {loadingProfile ? <Spinner /> : (
            <>
              {/* Row 1: Header */}
              <motion.header {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-2xl font-bold">Welcome back, <span className="text-gold-bright">{user.name?.split(' ')[0]}!</span></h2>
                  <p className="text-sm text-gray-500 mt-1.5">Let's dominate today.</p>
                </div>
                <div className="flex items-center gap-5 shrink-0">
                  <div className="hidden sm:flex flex-col gap-1.5 w-48">
                    <XPBar current={xp} max={2000} />
                    <p className="text-[10px] text-gray-600 text-right">Level {Math.floor(xp / 500) + 1}</p>
                  </div>
                  {badges.length > 0 && (
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-amber-900 shrink-0"
                      style={{ background: 'linear-gradient(135deg, #FBBF24, #F59E0B)', boxShadow: '0 0 12px rgba(251,191,36,0.4)' }}>
                      <Star size={12} className="fill-amber-900" /> {badges[0]}
                    </div>
                  )}
                </div>
              </motion.header>

              {/* Row 2: Quick Stats */}
              <section className="mb-12">
                <motion.p {...fadeUp(0.05)} className="text-xs text-gray-600 uppercase tracking-widest font-semibold mb-6">Quick Stats</motion.p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                  <StatCard title="LeetCode Solved" value={lc.totalSolved} sub={lc.ranking ? `Rank: ${lc.ranking}` : 'Connect LeetCode'} icon={Code2} color="#F97316" delay={0.08} />
                  <StatCard title="Codeforces Rating" value={cf.rating} sub={cf.rank || 'Connect Codeforces'} icon={TrendingUp} color="#60A5FA" delay={0.12} />
                  <StatCard title="Applications" value={jobs.length} sub="Live Opportunities" icon={Briefcase} color="#34D399" delay={0.16} />
                  <StatCard title="XP Earned" value={xp} sub={`${badges.length} badge${badges.length !== 1 ? 's' : ''} earned`} icon={Star} color="#A78BFA" delay={0.20} />
                </div>
              </section>

              {/* Row 3: AI Tools */}
              <section className="mb-12">
                <motion.p {...fadeUp(0.22)} className="text-xs text-gray-600 uppercase tracking-widest font-semibold mb-6">AI Power Tools</motion.p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ResumeCard />
                  <InterviewCard />
                </div>
              </section>

              {/* Row 4: Live Jobs */}
              <section>
                <motion.div {...fadeUp(0.35)} className="flex items-center justify-between mb-6">
                  <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold">Live Opportunities</p>
                  <button className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium">View all <ChevronRight size={13} /></button>
                </motion.div>
                {loadingJobs ? <Spinner /> : jobs.length === 0 ? (
                  <div className="text-center py-16 text-gray-600">
                    <Briefcase size={40} className="mx-auto mb-4 text-gray-700" />
                    <p className="text-sm">No live opportunities found. Check back soon!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {jobs.slice(0, 6).map((job, i) => <JobCard key={job._id || i} job={job} delay={0.38 + i * 0.06} />)}
                  </div>
                )}
              </section>
              <div className="h-16" />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
