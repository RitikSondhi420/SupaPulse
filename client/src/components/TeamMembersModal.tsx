import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, UserPlus, Shield, X, Check, 
  Trash2, UserCheck, AlertCircle, Plus 
} from 'lucide-react';

export const TeamMembersModal: React.FC = () => {
  const { 
    currentTeam, 
    teams, 
    users, 
    currentUser, 
    addTeamMember, 
    removeTeamMember, 
    createTeam, 
    showToast 
  } = useApp();

  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('#3ecf8e');

  const teamMembers = users.filter(u => u.teamIds.includes(currentTeam.id));
  const nonMembers = users.filter(u => !u.teamIds.includes(currentTeam.id));

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    createTeam(newTeamName.trim(), newTeamDesc.trim(), newTeamColor);
    setNewTeamName('');
    setNewTeamDesc('');
    setIsCreatingTeam(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#121212]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-[#161616] border border-[#242424] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#3ecf8e] text-xs font-semibold uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              <span>Multi-Tenant Team Isolation</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
              <span>{currentTeam.name} Roster & Permissions</span>
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: currentTeam.color }} 
              />
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              Data isolation is enforced per team. Members only see projects, backlog, completed, 
              and failed tasks within their permitted teams. Users can be assigned to multiple teams.
            </p>
          </div>

          <button
            onClick={() => setIsCreatingTeam(!isCreatingTeam)}
            className="py-2 px-3.5 rounded-xl bg-[#1e1e1e] hover:bg-[#252525] border border-[#333333] text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-all hover:border-[#3ecf8e]/50"
          >
            <Plus className="w-4 h-4 text-[#3ecf8e]" />
            <span>Create New Team</span>
          </button>
        </div>

        {/* Create Team Form if open */}
        {isCreatingTeam && (
          <form 
            onSubmit={handleCreateTeamSubmit}
            className="p-5 rounded-2xl bg-[#181818] border border-[#3ecf8e]/40 space-y-4 animate-in fade-in duration-200 shadow-[0_0_20px_rgba(62,207,142,0.1)]"
          >
            <div className="flex items-center justify-between border-b border-[#282828] pb-3">
              <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#3ecf8e]" />
                Create New Dedicated Team Workspace
              </h3>
              <button 
                type="button" 
                onClick={() => setIsCreatingTeam(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Team Name</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  placeholder="e.g. AI Research Guild"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] text-xs text-neutral-200 focus:border-[#3ecf8e] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Theme Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newTeamColor}
                    onChange={e => setNewTeamColor(e.target.value)}
                    className="w-10 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-neutral-400">{newTeamColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Description</label>
              <input
                type="text"
                value={newTeamDesc}
                onChange={e => setNewTeamDesc(e.target.value)}
                placeholder="Brief mission of this team..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] text-xs text-neutral-200 focus:border-[#3ecf8e] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingTeam(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs text-neutral-400 hover:text-neutral-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#3ecf8e] hover:bg-[#34b27b] text-neutral-950 font-semibold text-xs"
              >
                Create Team
              </button>
            </div>
          </form>
        )}

        {/* Current Team Members Table */}
        <div className="rounded-2xl border border-[#242424] bg-[#161616] overflow-hidden">
          <div className="p-4 bg-[#1a1a1a] border-b border-[#242424] flex items-center justify-between">
            <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wide flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#3ecf8e]" />
              Active Team Members ({teamMembers.length})
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono">
              Team: {currentTeam.slug}
            </span>
          </div>

          <div className="divide-y divide-[#202020]">
            {teamMembers.map(member => {
              const isCurrentUser = member.id === currentUser.id;
              let roleBadge = 'bg-neutral-800 text-neutral-400 border-neutral-700';
              if (member.role === 'Admin') roleBadge = 'bg-[#3ecf8e]/10 text-[#3ecf8e] border-[#3ecf8e]/30';
              if (member.role === 'Tester') roleBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
              if (member.role === 'Member') roleBadge = 'bg-blue-500/10 text-blue-400 border-blue-500/30';

              return (
                <div key={member.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#191919] transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#2e2e2e]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-200">
                          {member.name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] px-1.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {member.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${roleBadge}`}>
                        {member.role}
                      </span>
                      <div className="text-[10px] text-neutral-500 mt-0.5 font-mono">
                        Belongs to {member.teamIds.length} {member.teamIds.length === 1 ? 'team' : 'teams'}
                      </div>
                    </div>

                    {/* Remove Member button (Admin only) */}
                    {currentUser.role === 'Admin' && teamMembers.length > 1 && (
                      <button
                        onClick={() => removeTeamMember(currentTeam.id, member.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove member from this team"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Other Users to this Team (Admin feature) */}
        {nonMembers.length > 0 && currentUser.role === 'Admin' && (
          <div className="rounded-2xl border border-[#242424] bg-[#161616] p-5 space-y-3">
            <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wide flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#3ecf8e]" />
              Assign Other Organization Members to {currentTeam.name}
            </h3>
            <p className="text-xs text-neutral-400">
              Users can be in more than one team simultaneously. Grant them access below:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {nonMembers.map(user => (
                <div
                  key={user.id}
                  className="p-3 rounded-xl border border-[#262626] bg-[#191919] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#2e2e2e]"
                    />
                    <div>
                      <div className="text-xs font-semibold text-neutral-200">{user.name}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{user.role}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => addTeamMember(currentTeam.id, user.id)}
                    className="py-1 px-2.5 rounded-lg bg-[#3ecf8e]/10 hover:bg-[#3ecf8e]/20 border border-[#3ecf8e]/30 text-[#3ecf8e] text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Team</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
