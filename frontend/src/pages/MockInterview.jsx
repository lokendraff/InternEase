import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Mic, Video, Settings2, Play, Users, Code2,
  CheckCircle2, AlertTriangle, ShieldAlert, Award, ChevronRight, X, Send,
} from 'lucide-react';
import API from '../utils/axios';
import toast from 'react-hot-toast';

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
   Mock Interview Engine Page
   ══════════════════════════════════════════ */
export default function MockInterview() {
  const [state, setState] = useState('lobby'); // 'lobby' | 'active' | 'evaluating' | 'report'
  const [type, setType] = useState('technical');
  const [applicationId, setApplicationId] = useState('');
  
  const [interviewData, setInterviewData] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  
  const startInterview = async () => {
    if (!applicationId.trim()) {
      return toast.error('Please enter your Application ID');
    }
    
    try {
      toast.loading('Initializing AI Interviewer...', { id: 'init' });
      const { data } = await API.post('/api/interviews/generate', { applicationId: applicationId.trim() });
      setInterviewData(data);
      setAnswers(new Array(data.questions.length).fill(''));
      setCurrentQuestionIdx(0);
      setState('active');
      toast.success('Interview started!', { id: 'init' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview', { id: 'init' });
    }
  };

  const handleNextOrSubmit = async () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIdx] = currentAnswer;
    setAnswers(newAnswers);

    if (currentQuestionIdx < interviewData.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setCurrentAnswer('');
    } else {
      // Last question reached, evaluate
      try {
        setState('evaluating');
        const { data } = await API.post(`/api/interviews/${interviewData._id}/evaluate`, { answers: newAnswers });
        setInterviewData(data); // Updated with feedback and score
        setState('report');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to evaluate interview');
        setState('active'); // Revert back so they can try again
      }
    }
  };

  const endInterviewEarly = () => {
    if (confirm('Are you sure you want to end early? Your current answers will be evaluated.')) {
      handleNextOrSubmit();
    }
  };

  const reset = () => {
    setState('lobby');
    setApplicationId('');
    setInterviewData(null);
    setCurrentAnswer('');
    setAnswers([]);
    setCurrentQuestionIdx(0);
  };

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

          {/* ═══════ STATE 1: LOBBY ═══════ */}
          {state === 'lobby' && (
            <motion.div key="lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Settings */}
                <div className="lg:col-span-2 space-y-8">
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

                  <h3 className="text-lg font-bold text-amber-50 pt-4">Connection Details</h3>
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                    <label className="block text-sm font-bold text-gray-400 mb-2">Application ID (Required)</label>
                    <input 
                      type="text" 
                      placeholder="Paste your application ID here..." 
                      value={applicationId}
                      onChange={(e) => setApplicationId(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl p-4 text-amber-50 focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-2">The AI will generate questions based on the specific job description of your application.</p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 flex flex-col justify-center">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                      <Settings2 size={32} className="text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-amber-50 mb-2">Ready to Deploy?</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Ensure you are in a quiet environment. The AI will provide questions for you to answer in text.</p>
                  </div>
                  <motion.button onClick={startInterview} disabled={!applicationId.trim()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full relative flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-obsidian bg-gold glow-gold overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed">
                    <Play size={18} className="fill-obsidian" /> <span>Start Interview Session</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════ STATE 2: ACTIVE ROOM / EVALUATING ═══════ */}
          {(state === 'active' || state === 'evaluating') && interviewData && (
            <motion.div key="active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="min-h-[500px] flex flex-col">
              
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
                      <p className="text-xs text-gray-500">Question {currentQuestionIdx + 1} of {interviewData.questions.length}</p>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center relative z-10">
                    <p className="text-lg md:text-xl font-medium text-amber-50 leading-relaxed">
                      "{interviewData.questions[currentQuestionIdx].questionText}"
                    </p>
                  </div>
                </div>

                {/* User Answer Area & Controls */}
                <div className="flex flex-col gap-6">
                  {state === 'evaluating' ? (
                    <div className="flex-1 bg-white/[0.03] border border-amber-500/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-6" />
                      <h3 className="text-xl font-bold text-amber-50 mb-2">Analyzing Responses...</h3>
                      <p className="text-sm text-gray-400">Gemini AI is evaluating your technical accuracy and communication skills.</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 flex flex-col">
                        <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Your Answer</label>
                        <textarea
                          autoFocus
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          className="w-full flex-1 bg-transparent border-none outline-none resize-none text-emerald-50 text-sm leading-relaxed placeholder-gray-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={endInterviewEarly} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors text-red-400 text-sm font-semibold">
                          <X size={16} /> End Early
                        </button>
                        <button onClick={handleNextOrSubmit} disabled={!currentAnswer.trim()} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors text-amber-400 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                          {currentQuestionIdx === interviewData.questions.length - 1 ? (
                            <><Send size={16} /> Submit Interview</>
                          ) : (
                            <>Next Question <ChevronRight size={16} /></>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════ STATE 3: REPORT ═══════ */}
          {state === 'report' && (
            <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-display font-bold text-amber-50 mb-3">Interview Assessment Complete</h2>
                <p className="text-gray-400">Here is your AI-generated performance breakdown.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Score */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-10 flex flex-col items-center justify-center md:col-span-1">
                  <PerformanceRing score={interviewData?.overallScore || 0} />
                </div>

                {/* Question Feedback Breakdown */}
                <div className="md:col-span-2 space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                  {interviewData?.questions.map((q, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                      <div className="mb-4">
                        <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1.5">Question {i + 1}</p>
                        <p className="text-sm font-medium text-amber-50">{q.questionText}</p>
                      </div>
                      <div className="mb-4 pl-4 border-l-2 border-emerald-500/30">
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">Your Answer</p>
                        <p className="text-sm text-emerald-50/80">{q.answerText || 'No answer provided.'}</p>
                      </div>
                      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
                        <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><ShieldAlert size={12} /> AI Feedback</p>
                        <p className="text-sm text-gray-400 leading-relaxed">{q.aiFeedback}</p>
                      </div>
                    </div>
                  ))}

                  {/* XP Notification */}
                  <div className="bg-emerald-500/[0.05] border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-emerald-400 mb-1">XP Rewarded</h4>
                      <p className="text-sm text-emerald-200/70">For completing an AI technical interview</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-xl text-emerald-300 font-bold text-xl">
                      +150 XP
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-12">
                <button onClick={reset} className="px-8 py-4 rounded-xl font-bold text-obsidian bg-gold hover:bg-gold-bright transition-all glow-gold">
                  Return to Lobby
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
