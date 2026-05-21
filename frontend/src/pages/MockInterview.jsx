import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Mic, Play, Users, Code2,
  CheckCircle2, ShieldAlert, ChevronRight, Send, RotateCcw,
  FileText, BrainCircuit,
} from 'lucide-react';
import API from '../utils/axios';
import toast from 'react-hot-toast';

const TOTAL_QUESTIONS = 5;

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] },
});

/* ══════════════════════════════════════════
   Circular Performance Score
   ══════════════════════════════════════════ */
function PerformanceRing({ score, size = 160, stroke = 10 }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#FBBF24' : '#EF4444';
  const glow = score >= 80 ? 'rgba(16,185,129,0.5)' : score >= 60 ? 'rgba(251,191,36,0.5)' : 'rgba(239,68,68,0.5)';

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ}
          style={{ rotate: -90, originX: '50%', originY: '50%', filter: `drop-shadow(0 0 10px ${glow})` }}
          initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} />
        <text x="50%" y="46%" dominantBaseline="middle" textAnchor="middle" fill={color}
          fontSize="38" fontWeight="800" fontFamily="Inter, sans-serif">{score}%</text>
        <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fill="rgba(255,255,255,0.4)"
          fontSize="12" fontWeight="500" fontFamily="Inter, sans-serif">Overall</text>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════
   Thinking / Evaluating Animation
   ══════════════════════════════════════════ */
function ThinkingState({ title, subtitle }) {
  return (
    <motion.div key="thinking" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 gap-8">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BrainCircuit size={28} className="text-amber-400" />
        </div>
      </div>
      <div className="text-center">
        <motion.p className="text-xl font-bold text-amber-50 mb-2"
          animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          {title}
        </motion.p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   Mock Interview Engine Page
   ══════════════════════════════════════════ */
export default function MockInterview() {
  const location = useLocation();
  const hasResumeContext = location.state?.hasResumeContext || false;

  // ── State Machine ──
  // 'lobby' → 'generating' → 'active' → 'evaluating' → 'report'
  const [state, setState] = useState('lobby');
  const [type, setType] = useState('technical');
  const [jobDescription, setJobDescription] = useState('');

  // Interview data
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState([]);

  // Results
  const [reportData, setReportData] = useState(null);

  /* ── Start Interview: Generate Questions from JD ── */
  const startInterview = async () => {
    if (!jobDescription.trim()) {
      return toast.error('Please paste a Job Description to continue.');
    }

    try {
      setState('generating');
      toast.loading('Generating AI interview questions...', { id: 'gen' });

      const { data } = await API.post('/api/interviews/start', {
        jobDescription: jobDescription.trim(),
        interviewType: type,
      });

      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(''));
      setCurrentQuestionIdx(0);
      setCurrentAnswer('');
      setState('active');
      toast.success('Interview started! Good luck.', { id: 'gen' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate questions. Please try again.', { id: 'gen' });
      setState('lobby');
    }
  };

  /* ── Submit Answer & Advance ── */
  const handleNextOrSubmit = async () => {
    if (!currentAnswer.trim()) {
      return toast.error('Please type your answer before proceeding.');
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestionIdx] = currentAnswer.trim();
    setAnswers(newAnswers);

    if (currentQuestionIdx < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIdx(prev => prev + 1);
      setCurrentAnswer('');
    } else {
      // Last question — evaluate
      try {
        setState('evaluating');
        toast.loading('AI is evaluating your responses...', { id: 'eval' });

        const qnaPayload = questions.map((q, i) => ({
          question: q,
          answer: newAnswers[i] || '',
        }));

        const { data } = await API.post('/api/interviews/evaluate', {
          jobDescription: jobDescription.trim(),
          interviewType: type,
          qna: qnaPayload,
        });

        setReportData(data);
        setState('report');
        toast.success('Evaluation complete!', { id: 'eval' });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Evaluation failed. Try again.', { id: 'eval' });
        setState('active');
      }
    }
  };

  /* ── Reset ── */
  const reset = () => {
    setState('lobby');
    setJobDescription('');
    setQuestions([]);
    setCurrentAnswer('');
    setAnswers([]);
    setCurrentQuestionIdx(0);
    setReportData(null);
  };

  /* ── Progress Bar ── */
  const progressPercent = state === 'active'
    ? ((currentQuestionIdx) / TOTAL_QUESTIONS) * 100
    : state === 'report' ? 100 : 0;

  return (
    <div className="min-h-screen bg-obsidian text-amber-50">
      <div className="max-w-6xl mx-auto p-8 lg:p-12">

        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-amber-400 transition-all">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-amber-50">Mock Interview Engine</h1>
              <p className="text-sm text-gray-500 mt-1">Adaptive AI-driven assessment simulation</p>
            </div>
          </div>
          {state === 'active' && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Session Active</span>
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ═══════════════════════════════════════════
             STATE 1: LOBBY — Setup Track & JD
             ═══════════════════════════════════════════ */}
          {state === 'lobby' && (
            <motion.div key="lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>

              {/* Resume Context Banner */}
              {hasResumeContext && (
                <motion.div {...fadeUp(0)}
                  className="flex items-center gap-4 p-5 mb-10 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/[0.2]">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-300">Resume Context Loaded</p>
                    <p className="text-xs text-emerald-400/60 mt-0.5">Your analyzed resume data is linked. Paste a JD below for tailored cross-questions.</p>
                  </div>
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 ml-auto" />
                </motion.div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Settings */}
                <div className="lg:col-span-2 space-y-8">

                  {/* Track Selection */}
                  <h3 className="text-lg font-bold text-amber-50">Select Interview Track</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div onClick={() => setType('technical')}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${type === 'technical' ? 'border-amber-400 bg-amber-500/[0.08]' : 'border-white/[0.08] bg-white/[0.02] hover:border-amber-500/30'}`}>
                      <Code2 size={24} className={type === 'technical' ? 'text-amber-400' : 'text-gray-400'} />
                      <h4 className={`text-lg font-bold mt-4 ${type === 'technical' ? 'text-amber-50' : 'text-gray-300'}`}>Technical</h4>
                      <p className="text-sm text-gray-500 mt-2">Data structures, system design, and framework-specific questions.</p>
                    </div>
                    <div onClick={() => setType('behavioral')}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${type === 'behavioral' ? 'border-amber-400 bg-amber-500/[0.08]' : 'border-white/[0.08] bg-white/[0.02] hover:border-amber-500/30'}`}>
                      <Users size={24} className={type === 'behavioral' ? 'text-amber-400' : 'text-gray-400'} />
                      <h4 className={`text-lg font-bold mt-4 ${type === 'behavioral' ? 'text-amber-50' : 'text-gray-300'}`}>Behavioral</h4>
                      <p className="text-sm text-gray-500 mt-2">Leadership, conflict resolution, and situational assessments.</p>
                    </div>
                  </div>

                  {/* Job Description Textarea */}
                  <h3 className="text-lg font-bold text-amber-50 pt-4">Paste Job Description (JD)</h3>
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                    <textarea
                      rows={6}
                      placeholder="Paste the full Job Description here — e.g. responsibilities, required skills, tech stack, etc."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl p-4 text-amber-50 text-sm leading-relaxed resize-none
                        focus:outline-none focus:border-amber-500/50 transition-colors placeholder-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-3">
                      Paste the JD here. Our AI will ask <span className="text-amber-400 font-semibold">5 tailored cross-questions</span> based on this JD and your Resume.
                    </p>
                  </div>
                </div>

                {/* Right: Launch Panel */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 flex flex-col justify-center">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6"
                      style={{ boxShadow: '0 0 30px rgba(251,191,36,0.1)' }}>
                      <BrainCircuit size={32} className="text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-amber-50 mb-2">Ready to Deploy?</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Ensure you are in a quiet environment. The AI will provide {TOTAL_QUESTIONS} questions for you to answer in text.</p>
                  </div>

                  {/* Summary chips */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-xs text-gray-500">Track</span>
                      <span className="text-xs font-bold text-amber-400 capitalize">{type}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-xs text-gray-500">Questions</span>
                      <span className="text-xs font-bold text-amber-400">{TOTAL_QUESTIONS}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-xs text-gray-500">JD Status</span>
                      <span className={`text-xs font-bold ${jobDescription.trim() ? 'text-emerald-400' : 'text-red-400'}`}>
                        {jobDescription.trim() ? '✓ Ready' : '✗ Empty'}
                      </span>
                    </div>
                  </div>

                  <motion.button onClick={startInterview} disabled={!jobDescription.trim()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full relative flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-obsidian bg-gold glow-gold overflow-hidden group disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
                    <Play size={18} className="fill-obsidian" /> <span>Start Interview Session</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
             STATE 1.5: GENERATING QUESTIONS
             ═══════════════════════════════════════════ */}
          {state === 'generating' && (
            <ThinkingState
              title="Generating Interview Questions..."
              subtitle="Gemini AI is crafting 5 tailored questions from your JD."
            />
          )}

          {/* ═══════════════════════════════════════════
             STATE 2: ACTIVE INTERVIEW — 5 Questions
             ═══════════════════════════════════════════ */}
          {state === 'active' && questions.length > 0 && (
            <motion.div key="active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="min-h-[500px] flex flex-col gap-8">

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-amber-50">
                    Question <span className="text-amber-400">{currentQuestionIdx + 1}</span> of {questions.length}
                  </p>
                  <p className="text-xs text-gray-500">{Math.round(progressPercent)}% complete</p>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #F59E0B, #FBBF24, #FDE68A)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }} />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Question Box */}
                <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 flex flex-col overflow-hidden">
                  <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top left, rgba(251,191,36,0.03) 0%, transparent 70%)' }} />

                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <Mic size={18} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-amber-500">AI Interviewer</p>
                      <p className="text-xs text-gray-500">Question {currentQuestionIdx + 1} of {questions.length}</p>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center relative z-10">
                    <AnimatePresence mode="wait">
                      <motion.p key={currentQuestionIdx}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-lg md:text-xl font-medium text-amber-50 leading-relaxed">
                        "{questions[currentQuestionIdx]}"
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>

                {/* User Answer Area & Controls */}
                <div className="flex flex-col gap-6">
                  <div className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 flex flex-col">
                    <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Your Answer</label>
                    <textarea
                      autoFocus
                      rows={8}
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your answer here... Be specific, use examples where possible."
                      className="w-full flex-1 bg-transparent border-none outline-none resize-none text-emerald-50 text-sm leading-relaxed placeholder-gray-600"
                    />
                  </div>

                  <motion.button onClick={handleNextOrSubmit} disabled={!currentAnswer.trim()}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-obsidian bg-gold
                      glow-gold overflow-hidden group disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all">
                    <span className="relative z-10 flex items-center gap-2">
                      {currentQuestionIdx === questions.length - 1 ? (
                        <><Send size={16} /> Submit Interview</>
                      ) : (
                        <>Submit Answer & Next <ChevronRight size={16} /></>
                      )}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
             STATE 2.5: EVALUATING
             ═══════════════════════════════════════════ */}
          {state === 'evaluating' && (
            <ThinkingState
              title="Analyzing Responses..."
              subtitle="Gemini AI is evaluating your technical accuracy and communication skills."
            />
          )}

          {/* ═══════════════════════════════════════════
             STATE 3: REPORT — Interview Complete
             ═══════════════════════════════════════════ */}
          {state === 'report' && reportData && (
            <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-display font-bold text-amber-50 mb-3">Interview Assessment Complete</h2>
                <p className="text-gray-400">Here is your AI-generated performance breakdown.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Score */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-10 flex flex-col items-center justify-center md:col-span-1">
                  <PerformanceRing score={reportData.overallScore || 0} />
                </div>

                {/* Question Feedback Breakdown */}
                <div className="md:col-span-2 space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                  {(reportData.feedback || []).map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 * i }}
                      className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                      <div className="mb-4">
                        <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1.5">Question {i + 1}</p>
                        <p className="text-sm font-medium text-amber-50">{item.question}</p>
                      </div>
                      <div className="mb-4 pl-4 border-l-2 border-emerald-500/30">
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">Your Answer</p>
                        <p className="text-sm text-emerald-50/80">{item.answer || 'No answer provided.'}</p>
                      </div>
                      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
                        <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><ShieldAlert size={12} /> AI Feedback</p>
                        <p className="text-sm text-gray-400 leading-relaxed">{item.aiFeedback}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-12">
                <motion.button onClick={reset} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-base font-bold text-obsidian bg-gold overflow-hidden
                    glow-gold hover:glow-gold-intense transition-all duration-300">
                  <span className="relative z-10 flex items-center gap-2">
                    <RotateCcw size={18} /> Return to Lobby
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                    translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
