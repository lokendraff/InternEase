/**
 * HolographicHub — Right-side visual for auth pages.
 * Animated AI Robot + Holographic Book + floating code symbols.
 */
import { motion } from 'framer-motion';

const FLOATERS = [
  { id: 'a', x: 10, y: 15, symbol: '{ }',  sz: 'text-2xl',  d: 0,   dur: 6,   op: 0.7  },
  { id: 'b', x: 80, y: 10, symbol: '{ }',  sz: 'text-lg',   d: 1.4, dur: 7.2, op: 0.45 },
  { id: 'c', x: 60, y: 80, symbol: '{ }',  sz: 'text-xl',   d: 2.8, dur: 5.8, op: 0.55 },
  { id: 'd', x: 85, y: 40, symbol: '</>',   sz: 'text-xl',   d: 0.6, dur: 6.5, op: 0.6  },
  { id: 'e', x: 15, y: 65, symbol: '</>',   sz: 'text-base', d: 2.2, dur: 8,   op: 0.4  },
  { id: 'f', x: 70, y: 25, symbol: '✦',    sz: 'text-2xl',  d: 0.3, dur: 5,   op: 0.8  },
  { id: 'g', x: 25, y: 45, symbol: '✦',    sz: 'text-base', d: 1.8, dur: 6.8, op: 0.5  },
  { id: 'h', x: 85, y: 75, symbol: '✦',    sz: 'text-xl',   d: 3.2, dur: 5.5, op: 0.65 },
  { id: 'i', x: 8,  y: 85, symbol: '◆',    sz: 'text-lg',   d: 1.1, dur: 6.2, op: 0.55 },
  { id: 'j', x: 20, y: 25, symbol: '🎓',   sz: 'text-3xl',  d: 1.6, dur: 7,   op: 0.75 },
  { id: 'k', x: 75, y: 85, symbol: '🎓',   sz: 'text-xl',   d: 3.8, dur: 8.2, op: 0.45 },
  { id: 'l', x: 45, y: 10, symbol: '○',    sz: 'text-xl',   d: 0.7, dur: 6.3, op: 0.5  },
];

function Floater({ x, y, symbol, sz, d, dur, op }) {
  return (
    <motion.div
      className={`absolute font-mono font-bold select-none pointer-events-none ${sz}`}
      style={{ left: `${x}%`, top: `${y}%`, color: '#FBBF24', opacity: op,
        textShadow: '0 0 12px rgba(251,191,36,0.7), 0 0 28px rgba(251,191,36,0.3)' }}
      animate={{ y: [0, -15, 0], opacity: [op, op * 1.3, op] }}
      transition={{ duration: dur, delay: d, repeat: Infinity, ease: 'easeInOut' }}
    >
      {symbol}
    </motion.div>
  );
}

function RobotCenterpiece() {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Ambient glow */}
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 65%)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />

      {/* Robot */}
      <motion.svg width="140" height="120" viewBox="0 0 140 120" fill="none"
        animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="z-10" style={{ filter: 'drop-shadow(0 4px 20px rgba(251,191,36,0.6))', marginBottom: 20 }}>
        <path d="M30 40 Q70 10 110 40 L120 70 Q70 100 20 70 Z" fill="rgba(251,191,36,0.1)" stroke="#FBBF24" strokeWidth="2" strokeLinejoin="round" />
        <motion.circle cx="70" cy="55" r="14" fill="#FBBF24"
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Infinity }} />
        <circle cx="70" cy="55" r="5" fill="#0A0A0A" />
        <line x1="70" y1="15" x2="70" y2="25" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <circle cx="70" cy="12" r="3" fill="#FBBF24" />
        <motion.path d="M60 8 Q70 0 80 8" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"
          animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
      </motion.svg>

      {/* Holographic beam */}
      <motion.div className="absolute w-24 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(251,191,36,0.3), transparent)', clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0% 100%)', top: 90 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />

      {/* Book */}
      <motion.svg width="160" height="80" viewBox="0 0 160 80" fill="none"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="z-10" style={{ filter: 'drop-shadow(0 -5px 15px rgba(251,191,36,0.4))' }}>
        <path d="M80 60 Q40 80 10 50 L20 20 Q50 50 80 30 Z" fill="rgba(251,191,36,0.08)" stroke="#FBBF24" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M80 60 Q120 80 150 50 L140 20 Q110 50 80 30 Z" fill="rgba(251,191,36,0.08)" stroke="#FBBF24" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="80" y1="30" x2="80" y2="60" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <motion.line x1="35" y1="35" x2="65" y2="45" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity }} />
        <motion.line x1="125" y1="35" x2="95" y2="45" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 3, delay: 1, repeat: Infinity }} />
      </motion.svg>
    </div>
  );
}

export default function HolographicHub() {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-obsidian">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #0c0900 50%, #0A0A0A 100%)' }} />
      <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(circle, rgba(251,191,36,0.6) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      {FLOATERS.map((f) => <Floater key={f.id} {...f} />)}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <RobotCenterpiece />
        <motion.div className="mt-12 text-center z-20"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}>
          <p className="font-display text-lg font-bold tracking-[0.2em] uppercase" style={{ color: '#FBBF24', textShadow: '0 0 20px rgba(251,191,36,0.5)' }}>
            Intelligent Mentor
          </p>
          <p className="mt-2 text-sm tracking-widest" style={{ color: 'rgba(253,230,138,0.5)' }}>Empowering Your Future</p>
        </motion.div>
      </div>
      {/* Scan line */}
      <motion.div className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.2), transparent)' }}
        animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} />
      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-amber-500/30 rounded-tl-md" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-amber-500/30 rounded-tr-md" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-amber-500/30 rounded-bl-md" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-amber-500/30 rounded-br-md" />
    </div>
  );
}
