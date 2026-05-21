import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload, FileText, CheckCircle2, AlertTriangle, ArrowLeft,
  Sparkles, Target, TrendingUp, RotateCcw, Shield, Zap,
} from 'lucide-react';
import API from '../utils/axios';
import toast from 'react-hot-toast';

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] },
});

/* ══════════════════════════════════════════
   Circular Score Ring
   ══════════════════════════════════════════ */
function ScoreRing({ score, size = 200, stroke = 11 }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#FBBF24' : '#EF4444';
  const glow  = score >= 80 ? 'rgba(16,185,129,0.5)' : score >= 60 ? 'rgba(251,191,36,0.5)' : 'rgba(239,68,68,0.5)';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';

  return (
    <div className="flex flex-col items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ}
          style={{ rotate: -90, originX: '50%', originY: '50%', filter: `drop-shadow(0 0 10px ${glow})` }}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} />
        <text x="50%" y="44%" dominantBaseline="middle" textAnchor="middle" fill={color}
          fontSize="48" fontWeight="800" fontFamily="Inter, sans-serif">{score}</text>
        <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="rgba(255,255,255,0.35)"
          fontSize="14" fontWeight="500" fontFamily="Inter, sans-serif">/ 100</text>
      </svg>
      <div className="text-center">
        <p className="text-xl font-bold" style={{ color }}>{label}</p>
        <p className="text-xs text-gray-500 mt-1.5">ATS Compatibility Score</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Scanning Animation (State 2)
   ══════════════════════════════════════════ */
function ScanningState({ fileName }) {
  const steps = ['Extracting key metrics...', 'Analyzing formatting...', 'Matching ATS keywords...'];
  return (
    <motion.div key="scanning" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 gap-10">

      {/* Document with scanner */}
      <div className="relative w-36 h-48">
        <div className="absolute inset-0 rounded-2xl bg-white/[0.04] border border-white/[0.1] backdrop-blur-sm" />
        {/* Fake text lines */}
        <div className="absolute inset-x-6 top-8 space-y-3">
          {[92, 78, 88, 65, 82, 72, 55, 90].map((w, i) => (
            <div key={i} className="h-1.5 rounded-full bg-white/[0.07]" style={{ width: `${w}%` }} />
          ))}
        </div>
        {/* Glowing scan line */}
        <motion.div className="absolute left-2 right-2 h-[3px] rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #FBBF24, #FDE68A, #FBBF24, transparent)',
            boxShadow: '0 0 24px rgba(251,191,36,0.7), 0 0 48px rgba(251,191,36,0.3), 0 -6px 20px rgba(251,191,36,0.2), 0 6px 20px rgba(251,191,36,0.2)',
          }}
          animate={{ top: ['8%', '88%', '8%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-amber-400/60 rounded-tl-sm" />
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-amber-400/60 rounded-tr-sm" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-amber-400/60 rounded-bl-sm" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-amber-400/60 rounded-br-sm" />
      </div>

      {/* File name */}
      <div className="text-center">
        <motion.p className="text-xl font-bold text-amber-50 mb-2"
          animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          Scanning Resume...
        </motion.p>
        <p className="text-sm text-gray-500">{fileName}</p>
      </div>

      {/* Step-by-step progress */}
      <div className="space-y-4 w-full max-w-xs">
        {steps.map((step, i) => (
          <motion.div key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.8, duration: 0.5 }}
            className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.8 + 0.3, type: 'spring', stiffness: 300 }}
              className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
              <motion.div className="w-2 h-2 rounded-full bg-amber-400"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1, delay: i * 0.8, repeat: Infinity }} />
            </motion.div>
            <p className="text-sm text-gray-400">{step}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   Resume Analyzer Page
   ══════════════════════════════════════════ */
export default function ResumeAnalyzer() {
  const [state, setState] = useState('upload'); // 'upload' | 'scanning' | 'results'
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [results, setResults] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const processFile = useCallback(async (f) => {
    if (!f) return;
    setFile(f);
    setState('scanning');

    try {
      const formData = new FormData();
      formData.append('resume', f);

      const { data } = await API.post('/api/ai/analyze-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResults(data);
      setState('results');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
      setState('upload');
    }
  }, []);

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); };
  const handleInput = (e) => processFile(e.target.files[0]);
  const reset = () => { setState('upload'); setFile(null); setResults(null); if (inputRef.current) inputRef.current.value = ''; };

  const goToMockInterview = () => {
    navigate('/mock-interview', { state: { hasResumeContext: true } });
  };

  return (
    <div className="min-h-screen bg-obsidian text-amber-50">
      <div className="max-w-5xl mx-auto p-8 lg:p-12">

        {/* ── Page Header ── */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-4 mb-14">
          <Link to="/dashboard"
            className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-200">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-amber-50">AI Resume Analyzer</h1>
            <p className="text-sm text-gray-500 mt-1.5">Powered by Gemini AI Engine</p>
          </div>
        </motion.div>

        {/* ── State Machine ── */}
        <AnimatePresence mode="wait">

          {/* ═══════ STATE 1: Upload Zone ═══════ */}
          {state === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative h-96 cursor-pointer rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center
                  transition-all duration-300 overflow-hidden
                  ${dragOver
                    ? 'border-amber-400 bg-amber-400/[0.06] shadow-[0_0_80px_rgba(251,191,36,0.12)]'
                    : 'border-amber-500/30 bg-white/[0.02] hover:border-amber-500/50 hover:bg-white/[0.035]'
                  }`}>

                {/* Background radial glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)' }} />

                {/* Upload icon */}
                <motion.div animate={dragOver ? { scale: 1.15, y: -10 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }} className="relative mb-8">
                  <div className="w-24 h-24 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"
                    style={{ boxShadow: dragOver ? '0 0 40px rgba(251,191,36,0.5)' : '0 0 20px rgba(251,191,36,0.15)' }}>
                    <Upload size={36} className="text-amber-400" />
                  </div>
                </motion.div>

                <p className="text-xl font-bold text-amber-50 mb-3 relative z-10">
                  {dragOver ? 'Release to upload' : 'Drop your resume here (PDF) or click to browse'}
                </p>
                <p className="text-sm text-gray-500 mb-8 relative z-10">Powered by Gemini AI Engine</p>

                <div className="relative z-10 px-8 py-3.5 rounded-xl text-sm font-bold text-obsidian bg-gold glow-gold hover:bg-gold-bright transition-colors">
                  Browse Files
                </div>

                <input ref={inputRef} type="file" accept=".pdf" onChange={handleInput} onClick={(e) => e.stopPropagation()} className="hidden" />
              </div>

              {/* Feature tips */}
              <motion.div {...fadeUp(0.15)} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {[
                  { icon: Target, title: 'ATS Score', desc: 'Instant compatibility score against real Applicant Tracking Systems' },
                  { icon: Sparkles, title: 'AI Insights', desc: 'Gemini AI identifies missing keywords and structural weaknesses' },
                  { icon: TrendingUp, title: 'Actionable Tips', desc: 'Prioritized suggestions to maximize your interview callback rate' },
                ].map((t) => (
                  <div key={t.title} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 flex flex-col gap-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <t.icon size={20} className="text-amber-400" />
                    </div>
                    <p className="text-sm font-bold text-amber-50">{t.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ═══════ STATE 2: Scanning ═══════ */}
          {state === 'scanning' && <ScanningState fileName={file?.name} />}

          {/* ═══════ STATE 3: Results Dashboard ═══════ */}
          {state === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>

              {/* File info bar */}
              <motion.div {...fadeUp(0)}
                className="flex items-center justify-between bg-white/[0.03] border border-white/[0.08] rounded-2xl px-8 py-5 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <FileText size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-50">{file?.name}</p>
                    <p className="text-xs text-gray-500">{file ? `${(file.size / 1024).toFixed(1)} KB` : ''} · PDF</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 size={14} /> Analysis Complete
                </div>
              </motion.div>

              {/* Score Ring — Full Width Center */}
              <motion.div {...fadeUp(0.1)} className="flex justify-center mb-14">
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-14 inline-flex">
                  <ScoreRing score={results?.score ?? 0} />
                </div>
              </motion.div>

              {/* Two Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Left: Strengths & Keywords */}
                <motion.div {...fadeUp(0.2)} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 flex flex-col gap-8">
                  {/* Formatting */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <Shield size={18} className="text-emerald-400" />
                      <h3 className="text-base font-bold text-amber-50">Formatting Analysis</h3>
                    </div>
                    <div className="p-5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/[0.15]">
                      <p className="text-sm text-emerald-200 leading-relaxed">{results?.formatting}</p>
                    </div>
                  </div>

                  {/* Keywords Found */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <CheckCircle2 size={18} className="text-emerald-400" />
                      <h3 className="text-base font-bold text-amber-50">Keywords Detected</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {(results?.keywordsFound || []).map((kw, i) => (
                        <motion.span key={kw} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + i * 0.07 }}
                          className="px-4 py-2 rounded-xl text-sm font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
                          {kw}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Right: AI Suggestions */}
                <motion.div {...fadeUp(0.3)} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <AlertTriangle size={18} className="text-amber-400" />
                    <h3 className="text-base font-bold text-amber-50">AI Suggestions for Improvement</h3>
                  </div>
                  <div className="space-y-5">
                    {(results?.improvements || []).map((tip, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.12 }}
                        className="flex items-start gap-4 p-5 rounded-xl bg-amber-500/[0.05] border border-amber-500/[0.12]">
                        <span className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm text-gray-300 leading-relaxed pt-1">{tip}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* ── Action Buttons ── */}
              <motion.div {...fadeUp(0.5)} className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-14">
                {/* Scan Another Resume */}
                <motion.button onClick={reset} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-base font-bold text-amber-50
                    bg-white/[0.04] border border-white/[0.12] overflow-hidden
                    hover:border-amber-500/40 hover:bg-white/[0.06] transition-all duration-300 active:scale-[0.97]">
                  <span className="relative z-10 flex items-center gap-2">
                    <RotateCcw size={18} /> Scan Another Resume
                  </span>
                </motion.button>

                {/* Start AI Mock Interview — Prominent Gold CTA */}
                <motion.button onClick={goToMockInterview} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-base font-bold text-obsidian bg-gold overflow-hidden
                    glow-gold hover:glow-gold-intense transition-all duration-300 active:scale-[0.97]">
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap size={18} /> Start AI Mock Interview
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                    translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
