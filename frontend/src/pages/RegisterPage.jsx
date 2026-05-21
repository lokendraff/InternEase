import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ChevronDown, Zap, ShieldCheck } from 'lucide-react';
import HolographicHub from '../components/HolographicHub';
import API from '../utils/axios';
import toast from 'react-hot-toast';

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 30, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.72, delay: d, ease: [0.16, 1, 0.3, 1] },
});

/* ── Floating Input (same as LoginPage) ── */
function FloatingInput({ id, label, type = 'text', icon: Icon, value, onChange, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPw = type === 'password';
  const inputType = isPw && showPass ? 'text' : type;
  const isFloating = focused || value.length > 0;

  return (
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon size={18} className={`transition-colors duration-200 ${focused ? 'text-amber-400' : 'text-gray-600'}`} />
      </div>
      <input id={id} type={inputType} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        autoComplete={autoComplete} required placeholder=" "
        className={`w-full h-[60px] pl-[52px] pr-12 pt-5 pb-2 rounded-2xl text-[15px] text-amber-50
          bg-white/[0.04] border outline-none transition-all duration-300 placeholder-transparent
          ${focused ? 'border-amber-400/60 bg-amber-400/[0.04] shadow-[0_0_0_3px_rgba(251,191,36,0.1),0_0_24px_rgba(251,191,36,0.06)]' : 'border-white/[0.08] hover:border-white/[0.15]'}`}
        style={{ caretColor: '#FBBF24' }} />
      <label htmlFor={id}
        className="absolute left-[52px] pointer-events-none transition-all duration-200 origin-left"
        style={{ top: isFloating ? '10px' : '50%',
          transform: isFloating ? 'translateY(0) scale(0.75)' : 'translateY(-50%) scale(1)',
          color: isFloating && focused ? '#FBBF24' : isFloating ? 'rgba(253,230,138,0.5)' : 'rgba(156,163,175,0.7)',
          fontSize: '0.9375rem' }}>
        {label}
      </label>
      {isPw && (
        <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-amber-400 transition-colors duration-200">
          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}

/* ── Custom Select ── */
function PremiumSelect({ id, label, value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown size={18} className={`transition-colors duration-200 ${focused ? 'text-amber-400' : 'text-gray-600'}`} />
      </div>
      <label htmlFor={id} className="absolute left-[52px] top-[10px] text-[11px] font-medium tracking-wider uppercase pointer-events-none"
        style={{ color: focused ? '#FBBF24' : 'rgba(253,230,138,0.5)' }}>
        {label}
      </label>
      <select id={id} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className={`w-full h-[60px] pl-[52px] pr-12 pt-5 pb-2 rounded-2xl text-[15px] text-amber-50
          bg-white/[0.04] border outline-none transition-all duration-300 appearance-none cursor-pointer
          ${focused ? 'border-amber-400/60 bg-amber-400/[0.04] shadow-[0_0_0_3px_rgba(251,191,36,0.1)]' : 'border-white/[0.08] hover:border-white/[0.15]'}`}>
        {options.map(o => <option key={o.value} value={o.value} className="bg-[#111] text-amber-50">{o.label}</option>)}
      </select>
    </div>
  );
}

/* ══════════════════════════════════════════
   Register Page
   ══════════════════════════════════════════ */
export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'organizer' ? 'Organizer' : 'Student';
  const [form, setForm] = useState({ name: '', email: '', password: '', role: defaultRole });
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/api/auth/register', form);
      toast.success(data.message || 'OTP sent to your email!');
      setShowOTP(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/api/auth/verify-otp', { email: form.email, otp });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Account verified! 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-obsidian flex overflow-hidden">
      {/* ═══ LEFT — Form ═══ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 md:px-16 xl:px-24 py-16 relative z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 0% 0%, rgba(251,191,36,0.06) 0%, transparent 60%)' }} />

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
              Initialize <span className="gradient-text-gold">Profile</span>
            </h1>
            <p className="mt-4 text-base text-gray-400 leading-relaxed">Join the AI-powered career ecosystem.</p>
          </motion.div>

          {/* Animated Forms */}
          <AnimatePresence mode="wait">
            {!showOTP ? (
              <motion.form key="reg" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}
                onSubmit={handleRegister} className="space-y-6">

                <motion.div {...fadeUp(0.18)}>
                  <FloatingInput id="reg-name" label="Full Name" icon={User} value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" />
                </motion.div>
                <motion.div {...fadeUp(0.24)}>
                  <FloatingInput id="reg-email" label="Email Address" type="email" icon={Mail} value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
                </motion.div>
                <motion.div {...fadeUp(0.30)}>
                  <FloatingInput id="reg-password" label="Secure Password" type="password" icon={Lock} value={form.password} onChange={e => set('password', e.target.value)} autoComplete="new-password" />
                </motion.div>
                <motion.div {...fadeUp(0.36)}>
                  <PremiumSelect id="reg-role" label="I am a" value={form.role} onChange={e => set('role', e.target.value)}
                    options={[{ value: 'Student', label: 'Student' }, { value: 'Organizer', label: 'Organizer' }]} />
                </motion.div>

                <motion.div {...fadeUp(0.42)} className="pt-2">
                  <button type="submit" disabled={loading}
                    className="group relative w-full h-14 text-base font-bold text-obsidian bg-gold rounded-2xl overflow-hidden
                      transition-all duration-300 hover:bg-gold-bright disabled:opacity-60 disabled:cursor-not-allowed glow-gold hover:glow-gold-intense active:scale-[0.98]">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? <><div className="w-5 h-5 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" /> Sending...</> : <><Zap size={18} /> Create Account</>}
                    </span>
                    {!loading && <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />}
                  </button>
                </motion.div>
              </motion.form>
            ) : (
              <motion.form key="otp" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }} onSubmit={handleVerify} className="space-y-8">

                <div className="bg-amber-500/10 border border-amber-500/20 p-7 rounded-2xl text-center">
                  <ShieldCheck size={32} className="text-amber-400 mx-auto mb-3" />
                  <p className="text-sm text-amber-200 leading-relaxed">
                    A 6-digit code was sent to<br /><span className="font-bold text-amber-400">{form.email}</span>
                  </p>
                </div>

                <input id="reg-otp" type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)}
                  placeholder="Enter 6-Digit OTP" required
                  className="w-full h-16 px-5 rounded-2xl text-center text-2xl tracking-[0.5em] font-mono text-amber-50
                    bg-white/[0.04] border border-white/[0.08] outline-none transition-all duration-300
                    focus:border-amber-400/60 focus:bg-amber-400/[0.04] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)]
                    placeholder:text-gray-600 placeholder:text-base placeholder:tracking-normal placeholder:font-sans"
                  style={{ caretColor: '#FBBF24' }} />

                <button type="submit" disabled={loading}
                  className="group relative w-full h-14 text-base font-bold text-obsidian bg-gold rounded-2xl overflow-hidden
                    transition-all duration-300 hover:bg-gold-bright disabled:opacity-60 disabled:cursor-not-allowed glow-gold hover:glow-gold-intense active:scale-[0.98]">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? <><div className="w-5 h-5 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" /> Verifying...</> : <><ShieldCheck size={18} /> Verify Identity</>}
                  </span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.p {...fadeUp(0.48)} className="mt-14 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-gold hover:text-gold-bright transition-colors underline underline-offset-4 decoration-gold/30">
              Sign In
            </Link>
          </motion.p>
        </div>
      </div>

      {/* ═══ RIGHT — Holographic Hub ═══ */}
      <div className="hidden lg:block lg:w-1/2 relative border-l border-white/5">
        <HolographicHub />
      </div>
    </div>
  );
}
