import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  ShieldCheck, Check, X, KeyRound, Sparkles, 
  AlertCircle, UserPlus, LogIn, Mail, Lock, User as UserIcon 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, users, switchUser, login, signup, showToast } = useApp();
  
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In form state
  const [loginEmail, setLoginEmail] = useState('admin@supapulse.io');
  const [loginPassword, setLoginPassword] = useState('admin123');
  
  // Sign Up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('Member');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(loginEmail, loginPassword);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      showToast('error', 'Validation Error', 'Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    const success = await signup(signupName.trim(), signupEmail.trim(), signupPassword.trim(), signupRole);
    setIsSubmitting(false);
    if (success) {
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      onClose();
    }
  };

  const fillAdminCredentials = () => {
    setLoginEmail('admin@supapulse.io');
    setLoginPassword('admin123');
    setActiveTab('signin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-5 border-b border-[#2e2e2e] bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 flex items-center justify-center text-[#3ecf8e]">
              {activeTab === 'signin' ? <KeyRound className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                {activeTab === 'signin' ? 'Sign In to SupaPulse' : 'Create SupaPulse Account'}
              </h3>
              <p className="text-xs text-neutral-400">
                {activeTab === 'signin' 
                  ? 'Access your teams, tasks, and project workflows' 
                  : 'Register a new user with dedicated team permissions'}
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

        {/* Tab Switcher */}
        <div className="flex border-b border-[#262626] bg-[#121212] px-6 pt-3 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'signin'
                ? 'border-[#3ecf8e] text-[#3ecf8e]'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'signup'
                ? 'border-[#3ecf8e] text-[#3ecf8e]'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Create Account (Sign Up)
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {activeTab === 'signin' ? (
            <>
              {/* Default Admin Banner */}
              <div className="p-4 rounded-xl bg-[#1d2b22] border border-[#3ecf8e]/40 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#3ecf8e] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#3ecf8e]">Default Pre-Configured Admin Account</h4>
                      <button
                        type="button"
                        onClick={fillAdminCredentials}
                        className="text-[11px] underline text-[#3ecf8e] hover:text-[#52e4a4] transition-colors"
                      >
                        Auto-Fill
                      </button>
                    </div>
                    <p className="text-xs text-neutral-300 mt-1">
                      Ready out of the box with full administrative access:
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
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-sm text-neutral-200 font-mono transition-colors"
                    placeholder="admin@supapulse.io"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-neutral-400" /> Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-sm text-neutral-200 font-mono transition-colors"
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
                  {isSubmitting ? 'Authenticating with GraphQL...' : 'Sign In'}
                </button>
              </form>

              {/* Quick User Switcher to Test Multi-Team Isolation */}
              <div className="pt-2 border-t border-[#262626]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    1-Click Account Switcher
                  </span>
                  <span className="text-[11px] text-[#3ecf8e] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Team Isolation Demo
                  </span>
                </div>

                <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
                  Switch between seeded accounts to test role permissions and strict cross-team isolation:
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
                        type="button"
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
            </>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-neutral-400" /> Full Name
                </label>
                <input
                  type="text"
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-sm text-neutral-200 transition-colors"
                  placeholder="e.g. Jordan Lee"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" /> Email Address
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-sm text-neutral-200 font-mono transition-colors"
                  placeholder="jordan@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-neutral-400" /> Password
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-sm text-neutral-200 font-mono transition-colors"
                  placeholder="Create a strong password (min 6 chars)"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  System Role & Workflow Permissions
                </label>
                <select
                  value={signupRole}
                  onChange={e => setSignupRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-sm text-neutral-200 transition-colors"
                >
                  <option value="Member">Member (Engineer / Designer / Task Owner)</option>
                  <option value="Tester">Tester (QA Lead - Full Verdict Powers)</option>
                  <option value="Admin">Admin (Workspace & Rules Manager)</option>
                  <option value="Viewer">Viewer (Read-Only Stakeholder)</option>
                </select>
                <p className="text-[11px] text-neutral-400 mt-1.5">
                  {signupRole === 'Tester' && 'Can reject tasks back to In Progress with required QA notes or mark Verified Completed.'}
                  {signupRole === 'Member' && 'Can create, edit, drag tasks across allowed workflow columns in their assigned teams.'}
                  {signupRole === 'Admin' && 'Has full workspace administration, team creation, and workflow rule configuration.'}
                  {signupRole === 'Viewer' && 'Has read-only visibility into team boards and tasks.'}
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-[#3ecf8e] hover:bg-[#34b27b] text-neutral-950 font-semibold text-sm transition-all shadow-[0_0_15px_rgba(62,207,142,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                <UserPlus className="w-4 h-4" />
                {isSubmitting ? 'Registering with GraphQL...' : 'Create Account'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="text-xs text-neutral-400 hover:text-[#3ecf8e] transition-colors"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};