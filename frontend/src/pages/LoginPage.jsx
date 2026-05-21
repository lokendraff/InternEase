import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';
import HolographicHub from '../components/HolographicHub';
import API from '../utils/axios';
import toast from 'react-hot-toast';

/* ── Animation helper ── */
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 30, filter: 'blur(6px)' },
  animate:    { opacity: 1, y: 0,  filter: 'blur(0px)' },
  transition: { duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ══════════════════════════════════════════
   Floating Label Input
   ══════════════════════════════════════════ */
function FloatingInput({ id, label, type = 'text', icon: Icon, value, onChange, autoComplete }) {
  const [focused,  setFocused]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPw       = type === 'password';
  const inputType  = isPw && showPass ? 'text' : type;
  const isFloating = focused || value.length > 0;

  return (
    <div className="relative group">
      {/* Icon */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon size={18} className={`transition-colors duration-200 ${focused ? 'text-amber-400' : 'text-gray-600'}`} />
      </div>

      {/* Input */}
      <input
        id={id}
        type={inputType}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        required
        placeholder=" "
        className={`
          w-full h-[60px] pl-[52px] pr-12 pt-5 pb-2 rounded-2xl text-[15px] text-amber-50
          bg-white/[0.04] border outline-none transition-all duration-300
          placeholder-transparent
          ${focused
            ? 'border-amber-400/60 bg-amber-400/[0.04] shadow-[0_0_0_3px_rgba(251,191,36,0.1),0_0_24px_rgba(251,191,36,0.06)]'
            : 'border-white/[0.08] hover:border-white/[0.15]'
          }
        `}
        style={{ caretColor: '#FBBF24' }}
      />

      {/* Floating label */}
      <label
        htmlFor={id}
        className="absolute left-[52px] pointer-events-none transition-all duration-200 origin-left"
        style={{
          top:       isFloating ? '10px'   : '50%',
          transform: isFloating ? 'translateY(0) scale(0.75)' : 'translateY(-50%) scale(1)',
          color:     isFloating && focused ? '#FBBF24' : isFloating ? 'rgba(253,230,138,0.5)' : 'rgba(156,163,175,0.7)',
          fontSize:  '0.9375rem',
        }}
      >
        {label}
      </label>

      {/* Password toggle */}
      {isPw && (
        <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-amber-400 transition-colors duration-200">
          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Login Page
   ══════════════════════════════════════════ */
export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success(`Welcome back, ${data.name}! ⚡`);
      
      if (data.role === 'Organizer') {
        navigate('/organizer-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex overflow-hidden">

      {/* ═══ LEFT — Form (50 %) ═══ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 md:px-16 xl:px-24 py-16 relative z-10">

        {/* Corner glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 0% 0%, rgba(251,191,36,0.06) 0%, transparent 60%)' }} />

        {/* Content */}
        <div className="w-full max-w-md">

          {/* Logo */}
          <motion.div {...fadeUp(0.05)} className="mb-16">
            <Link to="/" className="inline-flex items-center group">
              <span className="font-display text-[1.65rem] font-bold tracking-tight text-amber-50">Intern</span>
              <span className="font-display text-[1.65rem] font-bold tracking-tight text-gold-bright">Ease</span>
              <span className="w-2 h-2 rounded-full bg-gold ml-1 mb-0.5 glow-gold group-hover:scale-150 transition-transform duration-300" />
            </Link>
          </motion.div>

          {/* Heading */}
          <motion.div {...fadeUp(0.12)} className="mb-12">
            <h1 className="font-display text-4xl md:text-[2.75rem] font-extrabold text-amber-50 leading-[1.15]">
              Welcome back.
            </h1>
            <p className="mt-4 text-base text-gray-400 leading-relaxed">
              Sign in to continue your career journey.
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <motion.div {...fadeUp(0.20)}>
              <FloatingInput id="login-email" label="Email address" type="email" icon={Mail}
                value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </motion.div>

            <motion.div {...fadeUp(0.27)}>
              <FloatingInput id="login-password" label="Password" type="password" icon={Lock}
                value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
            </motion.div>

            {/* <motion.div {...fadeUp(0.32)} className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-gold-bright transition-colors">
                Forgot password?
              </Link>
            </motion.div> */}

            <motion.div {...fadeUp(0.38)} className="pt-2">
              <button id="login-submit" type="submit" disabled={loading}
                className="group relative w-full h-14 text-base font-bold text-obsidian bg-gold rounded-2xl overflow-hidden
                  transition-all duration-300 hover:bg-gold-bright disabled:opacity-60 disabled:cursor-not-allowed
                  glow-gold hover:glow-gold-intense active:scale-[0.98]">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" /> Authenticating...</>
                  ) : (
                    <><Zap size={18} /> Sign In</>
                  )}
                </span>
                {!loading && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                    translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
                )}
              </button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.p {...fadeUp(0.46)} className="mt-14 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-gold hover:text-gold-bright transition-colors underline underline-offset-4 decoration-gold/30">
              Create one — it's free
            </Link>
          </motion.p>
        </div>
      </div>

      {/* ═══ RIGHT — Holographic Hub (50 %) ═══ */}
      <div className="hidden lg:block lg:w-1/2 relative border-l border-white/5">
        <HolographicHub />
      </div>
    </div>
  );
}
