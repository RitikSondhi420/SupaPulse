import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NotificationsPopover } from './NotificationsPopover';
import { AuthModal } from './AuthModal';
import { 
  Plus, Bell, ChevronDown, ShieldCheck, 
  Layers, Users, Sparkles, Check, KeyRound, RefreshCw 
} from 'lucide-react';

interface NavbarProps {
  onOpenNewTaskModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewTaskModal }) => {
  const { 
    currentUser, 
    currentTeam, 
    userTeams, 
    switchTeam, 
    unreadNotificationsCount,
    isBackendConnected,
    resetWorkspaceData 
  } = useApp();

  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-[#242424] bg-[#141414] px-4 flex items-center justify-between gap-4 z-30 shrink-0">
        {/* Brand & Team Switcher */}
        <div className="flex items-center gap-4">
          {/* Supabase Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 flex items-center justify-center text-[#3ecf8e] shadow-[0_0_15px_rgba(62,207,142,0.2)]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M21.362 9.354H12V.304a.304.304 0 0 0-.52-.214L.087 11.485a.305.305 0 0 0 .215.52h9.362v9.05a.305.305 0 0 0 .52.215l11.393-11.395a.305.305 0 0 0-.215-.521z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-neutral-100 font-sans">
                SupaPulse
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#222222] text-[#3ecf8e] border border-[#333333]">
                Asana Suite
              </span>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-[#282828] hidden md:block" />

          {/* Active Team Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsTeamMenuOpen(!isTeamMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#242424] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors text-xs font-semibold text-neutral-200"
            >
              <span 
                className="w-2.5 h-2.5 rounded-full shrink-0" 
                style={{ backgroundColor: currentTeam.color }} 
              />
              <span className="max-w-[140px] truncate">{currentTeam.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {isTeamMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setIsTeamMenuOpen(false)} 
                />
                <div className="absolute left-0 top-10 w-60 bg-[#181818] border border-[#2e2e2e] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase text-neutral-400 border-b border-[#242424] flex items-center justify-between">
                    <span>Your Accessible Teams</span>
                    <span className="font-mono text-[#3ecf8e]">{userTeams.length} available</span>
                  </div>

                  <div className="py-1">
                    {userTeams.map(team => (
                      <button
                        key={team.id}
                        onClick={() => {
                          switchTeam(team.id);
                          setIsTeamMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-[#222222] transition-colors ${
                          team.id === currentTeam.id 
                            ? 'text-[#3ecf8e] font-semibold bg-[#3ecf8e]/5' 
                            : 'text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span 
                            className="w-2 h-2 rounded-full shrink-0" 
                            style={{ backgroundColor: team.color }} 
                          />
                          <span className="truncate">{team.name}</span>
                        </div>
                        {team.id === currentTeam.id && <Check className="w-4 h-4 text-[#3ecf8e] shrink-0" />}
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-[#242424] bg-[#141414] text-[10px] text-neutral-400">
                    Strict isolation prevents viewing other teams’ data.
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Backend GraphQL Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono transition-colors">
            {isBackendConnected ? (
              <span className="flex items-center gap-1.5 text-[#3ecf8e]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e] animate-pulse" />
                <span>GraphQL Live (:4000)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Client Cache Mode</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Nav: New Task, Notifications, Switcher */}
        <div className="flex items-center gap-3">
          {/* New Task Button */}
          <button
            onClick={onOpenNewTaskModal}
            className="py-1.5 px-3 rounded-xl bg-[#3ecf8e] hover:bg-[#34b27b] text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(62,207,142,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl bg-[#1c1c1c] hover:bg-[#242424] border border-[#2a2a2a] text-neutral-300 hover:text-neutral-100 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#3ecf8e] text-neutral-950 text-[10px] font-bold flex items-center justify-center font-mono">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <NotificationsPopover
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
            />
          </div>

          {/* User Account / Role Switcher Pill */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#242424] border border-[#2a2a2a] hover:border-[#3ecf8e]/40 transition-all text-left"
            title="Click to switch user or review Admin credentials"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover border border-[#3ecf8e]/40"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-[11px] font-bold text-neutral-200 leading-tight">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-[#3ecf8e] font-mono leading-tight">
                {currentUser.role}
              </span>
            </div>
            <KeyRound className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
};
