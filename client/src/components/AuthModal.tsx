import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  ShieldCheck, X, KeyRound, UserPlus, 
  LogIn, Mail, Lock, User as UserIcon 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, showToast } = useApp();
  
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Sign Up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('Member');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showToast('error', 'Required Fields', 'Please enter your email and password.');
      return;
    }
    setIsSubmitting(true);
    const success = await login(loginEmail.trim(), loginPassword.trim());
    setIsSubmitting(false);
    if (success) {
      setLoginEmail('');
      setLoginPassword('');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
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
            Create Account
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          {activeTab === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" /> Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-sm text-neutral-200 transition-colors"
                  placeholder="name@company.com"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
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
                className="w-full py-2.5 px-4 rounded-xl bg-[#3ecf8e] hover:bg-[#34b27b] text-neutral-950 font-semibold text-sm transition-all shadow-[0_0_15px_rgba(62,207,142,0.25)] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-xs text-neutral-400 hover:text-[#3ecf8e] transition-colors"
                >
                  Don't have an account? <span className="text-[#3ecf8e] font-semibold underline">Create one</span>
                </button>
              </div>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-neutral-400" /> Full Name
                </label>
                <input
                  type="text"
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-sm text-neutral-200 transition-colors"
                  placeholder="e.g. Jordan Lee"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" /> Email Address
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-sm text-neutral-200 transition-colors"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-neutral-400" /> Password
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-sm text-neutral-200 font-mono transition-colors"
                  placeholder="Create a password (min 6 chars)"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Role & Workspace Access
                </label>
                <select
                  value={signupRole}
                  onChange={e => setSignupRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-sm text-neutral-200 transition-colors"
                >
                  <option value="Member">Member (Engineer / Designer / Task Owner)</option>
                  <option value="Tester">Tester (QA Lead - Task Verdicts & Testing)</option>
                  <option value="Admin">Admin (Workspace & Rules Manager)</option>
                  <option value="Viewer">Viewer (Read-Only)</option>
                </select>
                <p className="text-[11px] text-neutral-500 mt-1">
                  {signupRole === 'Tester' && 'QA verification rights: can pass tasks or reject them back to In Progress with notes.'}
                  {signupRole === 'Member' && 'Can manage tasks and collaborate within assigned teams.'}
                  {signupRole === 'Admin' && 'Full workspace rights, team management, and workflow policy configuration.'}
                  {signupRole === 'Viewer' && 'Read-only access to team dashboards and progress.'}
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-[#3ecf8e] hover:bg-[#34b27b] text-neutral-950 font-semibold text-sm transition-all shadow-[0_0_15px_rgba(62,207,142,0.25)] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="text-xs text-neutral-400 hover:text-[#3ecf8e] transition-colors"
                >
                  Already have an account? <span className="text-[#3ecf8e] font-semibold underline">Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};