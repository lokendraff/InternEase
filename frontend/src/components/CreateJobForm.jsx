import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import API from '../utils/axios';
import toast from 'react-hot-toast';

export default function CreateJobForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Internship');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) { setSkills([...skills, s]); setSkillInput(''); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return toast.error('Title and description are required.');
    setSubmitting(true);
    try {
      await API.post('/api/opportunities', { title: title.trim(), description: description.trim(), type, skillsRequired: skills });
      toast.success('Opportunity created! 🎉');
      setTitle(''); setDescription(''); setSkills([]); setType('Internship');
      onCreated?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create opportunity');
    } finally { setSubmitting(false); }
  };

  const inputCls = "w-full bg-black/40 border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-amber-50 focus:outline-none focus:border-amber-500/50 transition-colors placeholder-gray-600";

  return (
    <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 space-y-6">
      <h3 className="text-lg font-bold text-amber-50">Post New Opportunity</h3>

      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Frontend Developer Intern" className={inputCls} />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Description</label>
        <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Describe the role, responsibilities, and requirements..." className={`${inputCls} resize-none`} />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Type</label>
        <div className="flex gap-3">
          {['Internship', 'Event'].map(t => (
            <button key={t} type="button" onClick={() => setType(t)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${type === t ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Skills Required</label>
        <div className="flex gap-2 mb-3">
          <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            placeholder="Type a skill and press Enter" className={`${inputCls} flex-1`} />
          <button type="button" onClick={addSkill} className="p-3 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"><Plus size={16} /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((s, i) => (
            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] border border-white/[0.1] rounded-lg text-xs text-gray-300">
              {s} <button type="button" onClick={() => setSkills(skills.filter((_, j) => j !== i))}><X size={12} className="text-gray-500 hover:text-red-400" /></button>
            </span>
          ))}
        </div>
      </div>

      <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-amber-500 to-amber-400 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(251,191,36,0.2)]">
        {submitting ? 'Posting...' : '🚀 Publish Opportunity'}
      </motion.button>
    </form>
  );
}
