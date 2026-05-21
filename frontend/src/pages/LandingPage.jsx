import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Building2, FileText, Mic, Trophy, ArrowRight } from 'lucide-react';
import ParticleSphere from '../components/ParticleSphere';
import Navbar from '../components/Navbar';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.11, delayChildren: 0.25 } } };
const item = { hidden: { opacity: 0, y: 44, filter: 'blur(10px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } } };
const badge = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.9 } } };

const FEATURES = [
  { icon: FileText, title: 'AI Resume Analyzer', desc: 'Get real-time ATS scoring powered by Gemini AI. Optimize keywords, formatting, and impact.' },
  { icon: Mic, title: 'Mock Interview Engine', desc: 'Practice with adaptive AI interviews — technical, behavioral, and system design rounds.' },
  { icon: Trophy, title: 'Gamified Leaderboard', desc: 'Earn XP, unlock badges, and climb the ranks. Compete with students nationwide.' },
  { icon: Building2, title: 'Live Job Feed', desc: 'Real-time internship and job listings aggregated from top platforms — always fresh.' },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-obsidian overflow-hidden">
      <ParticleSphere />
      <Navbar />

      {/* ═══ Hero Section ═══ */}
      <section className="relative min-h-screen flex items-center justify-center z-10 px-6 pt-20">
        {/* Ambient orbs */}
        <div className="absolute animate-pulse-glow pointer-events-none" style={{ width: 640, height: 640, background: 'radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)', top: '5%', left: '55%' }} />
        <div className="absolute animate-pulse-glow pointer-events-none" style={{ width: 420, height: 420, background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', bottom: '10%', left: '5%', animationDelay: '3s' }} />

        <motion.div variants={container} initial="hidden" animate="visible" className="relative text-center max-w-4xl mx-auto">
          {/* Live badge */}
          <motion.div variants={badge} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
            </span>
            <span className="text-xs font-semibold text-gold-bright tracking-widest uppercase">Platform Live — 2026 Cohort Open</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={item} className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            <span className="text-amber-50">The Next-Gen</span><br />
            <span className="gradient-text-gold text-glow-gold">AI-Powered</span>
            <span className="text-amber-50"> Career</span><br className="hidden sm:block" />
            <span className="text-amber-50"> Ecosystem</span>
          </motion.h1>

          {/* Sub */}
          <motion.p variants={item} className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Get your resume <span className="text-gold-bright font-semibold">ATS-scored by Gemini AI</span>, crack mock interviews, and land real-time jobs in a <span className="text-gold-bright font-semibold">gamified arena</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 md:mt-12">
            <Link to="/register"
              className="group relative inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-obsidian bg-gold rounded-2xl overflow-hidden transition-all duration-300 hover:bg-gold-bright glow-gold hover:glow-gold-intense active:scale-[0.97]">
              <span className="relative z-10 flex items-center gap-2"><Zap size={18} /> Launch Student Portal</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            </Link>
            <Link to="/register?role=organizer"
              className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-gold-bright border border-gold/30 rounded-2xl glass transition-all duration-300 hover:bg-gold/10 hover:border-gold/60 active:scale-[0.97]">
              <Building2 size={18} /> For Organizers
            </Link>
          </motion.div>

          {/* Trust bar */}
          <motion.div variants={item} className="mt-14 md:mt-16 flex flex-col items-center gap-4">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-widest">Powered by</p>
            <div className="flex items-center gap-8 md:gap-12 opacity-45">
              {['Gemini AI', 'MongoDB Atlas', 'Supabase'].map(name => (
                <span key={name} className="text-sm font-medium text-gray-400">{name}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-obsidian to-transparent z-10 pointer-events-none" />
      </section>

      {/* ═══ Features Section ═══ */}
      <section id="features" className="relative z-10 py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-16 md:mb-20">
            <p className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-4">Core Features</p>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-amber-50">
              Everything you need to <span className="gradient-text-gold">dominate</span> your career.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(251,191,36,0.1), 0 0 0 1px rgba(251,191,36,0.15)' }}
                  className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-10 flex flex-col gap-5 transition-shadow duration-300 cursor-default">
                  <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Icon size={24} className="text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-50">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CTA Section ═══ */}
      <section className="relative z-10 py-24 md:py-32 px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center bg-white/[0.03] border border-white/[0.08] rounded-3xl p-12 md:p-16 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)' }} />
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-amber-50 mb-6">
            Ready to <span className="gradient-text-gold">level up</span>?
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-lg mx-auto">
            Join thousands of students using AI to crack interviews, optimize resumes, and land their dream roles.
          </p>
          <Link to="/register"
            className="group relative inline-flex items-center gap-2 px-10 py-4 text-base font-bold text-obsidian bg-gold rounded-2xl overflow-hidden glow-gold hover:glow-gold-intense transition-all duration-300 active:scale-[0.97]">
            <span className="relative z-10 flex items-center gap-2">Get Started Free <ArrowRight size={18} /></span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
          </Link>
        </motion.div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="relative z-10 border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <span className="font-display text-lg font-bold text-amber-50">Intern</span>
            <span className="font-display text-lg font-bold text-gold-bright">Ease</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold ml-1 mb-0.5" />
          </div>
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} InternEase. Built with Gemini AI.</p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
