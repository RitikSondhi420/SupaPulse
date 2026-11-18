import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User, Check, X, KeyRound, Sparkles, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, users, switchUser, login, showToast } = useApp();
  const [emailInput, setEmailInput] = useState('admin@supapulse.io');
  const [passwordInput, setPasswordInput] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(emailInput, passwordInput);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="p-5 border-b border-[#2e2e2e] bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 flex items-center justify-center text-[#3ecf8e]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                Authentication & Team Access
              </h3>
              <p className="text-xs text-neutral-400">
                Default Admin Login & Multi-Tenant Role Switcher
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Default Admin Banner */}
          <div className="p-4 rounded-xl bg-[#1d2b22] border border-[#3ecf8e]/40 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#3ecf8e] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#3ecf8e]">Default Pre-Configured Admin Account</h4>
                <p className="text-xs text-neutral-300 mt-1">
                  The system is equipped with an Asana-Supabase default administrator credential:
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2 text-xs font-mono">
                  <div className="px-2.5 py-1 rounded bg-black/40 border border-[#3ecf8e]/30 text-neutral-200">
                    <span className="text-neutral-400">Email:</span> <span className="text-[#3ecf8e]">admin@supapulse.io</span>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-black/40 border border-[#3ecf8e]/30 text-neutral-200">
                    <span className="text-neutral-400">Password:</span> <span className="text-[#3ecf8e]">admin123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Email Address</label>
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-sm text-neutral-200 font-mono transition-colors"
                placeholder="admin@supapulse.io"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-sm text-neutral-200 font-mono transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#3ecf8e] hover:bg-[#34b27b] text-neutral-950 font-semibold text-sm transition-all shadow-[0_0_15px_rgba(62,207,142,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              {isSubmitting ? 'Authenticating with GraphQL...' : 'Sign In to SupaPulse'}
            </button>
          </form>

          {/* Quick User Switcher to Test Multi-Team Isolation */}
          <div className="pt-2 border-t border-[#262626]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                1-Click Account Switcher (Test Team Isolation)
              </span>
              <span className="text-[11px] text-[#3ecf8e] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Live Demo
              </span>
            </div>

            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              Switch between users below to test the strict team boundaries. Sarah only sees Core Engineering, Elena only sees Design, Marcus has Tester privileges, and Admin has global oversight:
            </p>

            <div className="space-y-2">
              {users.map(u => {
                const isCurrent = u.id === currentUser.id;
                let roleColor = 'text-neutral-400 bg-neutral-800 border-neutral-700';
                if (u.role === 'Admin') roleColor = 'text-[#3ecf8e] bg-[#3ecf8e]/10 border-[#3ecf8e]/30';
                if (u.role === 'Tester') roleColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
                if (u.role === 'Member') roleColor = 'text-blue-400 bg-blue-500/10 border-blue-500/30';

                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                      isCurrent
                        ? 'border-[#3ecf8e] bg-[#1e2722]/50 shadow-[0_0_10px_rgba(62,207,142,0.1)]'
                        : 'border-[#262626] bg-[#141414] hover:border-neutral-700 hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#2e2e2e]"
                      />
                      <div>
                        <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                          {u.name}
                          <span className={`px-1.5 py-0.2 rounded text-[10px] border ${roleColor}`}>
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {u.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCurrent ? (
                        <span className="flex items-center gap-1 text-xs text-[#3ecf8e] font-medium">
                          <Check className="w-4 h-4" /> Active
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-500 group-hover:text-neutral-300">
                          Switch
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
