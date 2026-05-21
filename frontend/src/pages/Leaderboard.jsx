import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, Medal, Zap } from 'lucide-react';

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] },
});

const TOP_3 = [
  { rank: 2, name: 'Sarah Jenkins', xp: 14200, role: 'Frontend Dev', color: '#9CA3AF', shadow: 'rgba(156,163,175,0.4)', delay: 0.3 },
  { rank: 1, name: 'Alex Rivera', xp: 18500, role: 'Full Stack', color: '#FBBF24', shadow: 'rgba(251,191,36,0.6)', delay: 0.1 },
  { rank: 3, name: 'David Chen', xp: 12100, role: 'Backend Eng', color: '#B45309', shadow: 'rgba(180,83,9,0.5)', delay: 0.5 },
];

const REST = [
  { rank: 4, name: 'Emma Wilson', xp: 11050, badges: 8 },
  { rank: 5, name: 'Michael Chang', xp: 10800, badges: 7 },
  { rank: 6, name: 'Sophia Patel', xp: 9500, badges: 6 },
  { rank: 7, name: 'James Morrison', xp: 8200, badges: 4 },
  { rank: 8, name: 'Olivia Kim', xp: 7900, badges: 4 },
];

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-obsidian text-amber-50">
      <div className="max-w-5xl mx-auto p-8 lg:p-12">

        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-amber-400 transition-all">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-amber-50 flex items-center gap-3">
                Global Leaderboard <Trophy size={24} className="text-amber-400" />
              </h1>
              <p className="text-sm text-gray-500 mt-1">Top performers across all technical assessments.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08]">
            <Zap size={14} className="text-amber-400" /> <span className="text-xs font-bold text-gray-400">Current Season: 2026</span>
          </div>
        </motion.div>

        {/* ── Podium (Top 3) ── */}
        <div className="flex justify-center items-end gap-4 sm:gap-8 h-72 mb-20 px-4">
          {TOP_3.map((u) => (
            <motion.div key={u.rank}
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: u.delay, type: 'spring' }}
              className="relative flex flex-col items-center w-full max-w-[160px]">
              
              {/* Avatar */}
              <div className="relative mb-4 z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-obsidian flex items-center justify-center border-4"
                  style={{ borderColor: u.color, boxShadow: `0 0 20px ${u.shadow}` }}>
                  <span className="text-xl font-bold">{u.name.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-obsidian border-2 flex items-center justify-center text-xs font-bold"
                  style={{ borderColor: u.color, color: u.color }}>
                  {u.rank}
                </div>
              </div>

              <div className="text-center mb-4 opacity-0 animate-[fadeIn_0.5s_ease-in_forwards]" style={{ animationDelay: `${u.delay + 0.3}s` }}>
                <p className="font-bold text-sm sm:text-base truncate w-full px-2">{u.name}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{u.xp} XP</p>
              </div>

              {/* Pedestal */}
              <div className="w-full rounded-t-2xl border-t border-x"
                style={{
                  height: u.rank === 1 ? '140px' : u.rank === 2 ? '100px' : '70px',
                  background: `linear-gradient(to top, rgba(255,255,255,0.02), ${u.color}22)`,
                  borderColor: `${u.color}44`,
                }}>
                <div className="w-full h-full flex justify-center pt-4 opacity-30">
                  <Medal size={32} color={u.color} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── List (4-10) ── */}
        <motion.div {...fadeUp(0.6)} className="bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/[0.06] text-xs font-bold text-gray-500 uppercase tracking-widest">
            <div className="col-span-2 sm:col-span-1">Rank</div>
            <div className="col-span-6 sm:col-span-5">Student</div>
            <div className="hidden sm:block col-span-3 text-center">Badges</div>
            <div className="col-span-4 sm:col-span-3 text-right">Total XP</div>
          </div>
          
          <div className="divide-y divide-white/[0.04]">
            {REST.map((u, i) => (
              <motion.div key={u.rank} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
                className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-white/[0.03] transition-colors cursor-default">
                <div className="col-span-2 sm:col-span-1 font-mono text-gray-400 font-bold">{u.rank}</div>
                <div className="col-span-6 sm:col-span-5 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">{u.name.charAt(0)}</div>
                  <p className="font-semibold text-sm">{u.name}</p>
                </div>
                <div className="hidden sm:flex col-span-3 items-center justify-center gap-1.5">
                  <Star size={14} className="text-amber-500 fill-amber-500/20" />
                  <span className="text-sm text-gray-400">{u.badges}</span>
                </div>
                <div className="col-span-4 sm:col-span-3 text-right">
                  <span className="inline-block px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                    {u.xp.toLocaleString()} XP
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
