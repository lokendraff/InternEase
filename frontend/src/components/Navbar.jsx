import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'Leaderboard', href: '/leaderboard' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => setMobileOpen(false), [location]);

  return (
    <>
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass shadow-lg shadow-black/30' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <span className="font-display text-[1.6rem] font-bold tracking-tight text-amber-50">Intern</span>
              <span className="font-display text-[1.6rem] font-bold tracking-tight text-gold-bright">Ease</span>
              <span className="w-[7px] h-[7px] rounded-full bg-gold ml-[3px] mb-[3px] glow-gold group-hover:scale-150 transition-transform duration-300" />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {links.map(l => (
                <Link key={l.label} to={l.href}
                  className={`relative text-sm font-medium transition-colors duration-300 group ${location.pathname === l.href ? 'text-gold-bright' : 'text-gray-400 hover:text-amber-50'}`}>
                  {l.label}
                  <span className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-gold transition-all duration-300 ${location.pathname === l.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-amber-50 transition-colors">Sign In</Link>
              <Link to="/register"
                className="group relative px-5 py-2.5 text-sm font-semibold text-obsidian bg-gold rounded-xl overflow-hidden transition-all duration-300 hover:bg-gold-bright glow-gold active:scale-95">
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-600" />
              </Link>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(v => !v)} className="md:hidden p-2 text-amber-50">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-2xl" />
            <div className="relative flex flex-col items-center justify-center h-full gap-8">
              {links.map((l, i) => (
                <motion.div key={l.label} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link to={l.href} className="text-2xl font-display font-semibold text-amber-50 hover:text-gold transition-colors">{l.label}</Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-4 mt-4">
                <Link to="/login" className="px-6 py-3 text-sm font-medium text-gray-400 border border-white/10 rounded-xl glass hover:text-amber-50 transition">Sign In</Link>
                <Link to="/register" className="px-6 py-3 text-sm font-semibold text-obsidian bg-gold rounded-xl glow-gold">Get Started</Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
