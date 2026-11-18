import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Kanban, ListOrdered, GitMerge, Users, 
  FolderKanban, Plus, Lock, Check, Layers, 
  RotateCcw, Sparkles, ChevronRight, Hash 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    currentTeam, 
    teams, 
    userTeams, 
    switchTeam, 
    teamProjects, 
    currentProject, 
    setCurrentProject, 
    createProject, 
    tasks, 
    currentUser, 
    resetWorkspaceData 
  } = useApp();

  const [isCreatingProj, setIsCreatingProj] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjKey, setNewProjKey] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim() || !newProjKey.trim()) return;

    createProject(newProjName.trim(), newProjKey.trim(), newProjDesc.trim(), currentTeam.color);
    setNewProjName('');
    setNewProjKey('');
    setNewProjDesc('');
    setIsCreatingProj(false);
  };

  return (
    <aside className="w-64 border-r border-[#242424] bg-[#141414] flex flex-col shrink-0 overflow-y-auto">
      {/* Workspace / Active Team Header */}
      <div className="p-4 border-b border-[#242424]">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-950 font-bold text-xs"
            style={{ backgroundColor: currentTeam.color }}
          >
            {currentTeam.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xs font-bold text-neutral-100 truncate">
              {currentTeam.name}
            </h2>
            <p className="text-[10px] text-neutral-400 font-mono">
              team/{currentTeam.slug}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Views */}
      <div className="p-3 space-y-1">
        <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
          Views & Workflows
        </span>

        <button
          onClick={() => setActiveView('board')}
          className={`w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
            activeView === 'board'
              ? 'bg-[#1e2722] text-[#3ecf8e] border border-[#3ecf8e]/30 shadow-[0_0_10px_rgba(62,207,142,0.1)]'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Kanban className="w-4 h-4" />
          <span>Kanban Board</span>
        </button>

        <button
          onClick={() => setActiveView('list')}
          className={`w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
            activeView === 'list'
              ? 'bg-[#1e2722] text-[#3ecf8e] border border-[#3ecf8e]/30 shadow-[0_0_10px_rgba(62,207,142,0.1)]'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>List View</span>
        </button>

        <button
          onClick={() => setActiveView('rules')}
          className={`w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
            activeView === 'rules'
              ? 'bg-[#1e2722] text-[#3ecf8e] border border-[#3ecf8e]/30 shadow-[0_0_10px_rgba(62,207,142,0.1)]'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <GitMerge className="w-4 h-4" />
          <span>Workflow Rules</span>
        </button>

        <button
          onClick={() => setActiveView('members')}
          className={`w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
            activeView === 'members'
              ? 'bg-[#1e2722] text-[#3ecf8e] border border-[#3ecf8e]/30 shadow-[0_0_10px_rgba(62,207,142,0.1)]'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Team & Roles</span>
        </button>
      </div>

      <div className="h-[1px] bg-[#222222] my-2 mx-3" />

      {/* Projects List */}
      <div className="p-3 flex-1 space-y-1">
        <div className="flex items-center justify-between px-2 mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
            Team Projects
          </span>
          <button
            onClick={() => setIsCreatingProj(!isCreatingProj)}
            className="p-1 text-neutral-500 hover:text-[#3ecf8e] rounded transition-colors"
            title="Create Project in Team"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* All Projects Option */}
        <button
          onClick={() => setCurrentProject(null)}
          className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
            currentProject === null
              ? 'bg-[#222222] text-neutral-100 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#191919]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
            <span>All Projects</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-500">
            {tasks.filter(t => t.teamId === currentTeam.id).length}
          </span>
        </button>

        {/* Projects in active team */}
        {teamProjects.map(proj => {
          const projTaskCount = tasks.filter(t => t.projectId === proj.id).length;
          const isSelected = currentProject?.id === proj.id;

          return (
            <button
              key={proj.id}
              onClick={() => setCurrentProject(proj)}
              className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                isSelected
                  ? 'bg-[#222222] text-[#3ecf8e] font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#191919]'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span 
                  className="w-1.5 h-1.5 rounded-full shrink-0" 
                  style={{ backgroundColor: proj.color }} 
                />
                <span className="truncate">{proj.name}</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                {projTaskCount}
              </span>
            </button>
          );
        })}

        {/* Create Project Mini Form */}
        {isCreatingProj && (
          <form onSubmit={handleCreateProjectSubmit} className="p-2.5 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] space-y-2 mt-2">
            <input
              type="text"
              value={newProjName}
              onChange={e => setNewProjName(e.target.value)}
              placeholder="Project Name..."
              className="w-full px-2.5 py-1 text-xs rounded bg-[#121212] border border-[#333333] text-neutral-200 focus:border-[#3ecf8e] focus:outline-none"
              required
            />
            <input
              type="text"
              value={newProjKey}
              onChange={e => setNewProjKey(e.target.value.toUpperCase())}
              placeholder="Key prefix (e.g. API)"
              className="w-full px-2.5 py-1 text-xs rounded bg-[#121212] border border-[#333333] text-neutral-200 font-mono focus:border-[#3ecf8e] focus:outline-none"
              maxLength={5}
              required
            />
            <div className="flex justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsCreatingProj(false)}
                className="px-2 py-0.5 text-[11px] text-neutral-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2.5 py-0.5 text-[11px] rounded bg-[#3ecf8e] text-neutral-950 font-bold"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="h-[1px] bg-[#222222] my-2 mx-3" />

      {/* Organization Teams & Isolation Status */}
      <div className="p-3 space-y-1">
        <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
          Organization Teams
        </span>

        {teams.map(team => {
          const isMember = currentUser.role === 'Admin' || currentUser.teamIds.includes(team.id);
          const isCurrent = currentTeam.id === team.id;

          return (
            <button
              key={team.id}
              onClick={() => {
                if (isMember) {
                  switchTeam(team.id);
                }
              }}
              disabled={!isMember}
              className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                isCurrent
                  ? 'bg-[#1c241f] text-[#3ecf8e] font-semibold'
                  : isMember
                  ? 'text-neutral-400 hover:text-neutral-200 hover:bg-[#191919]'
                  : 'text-neutral-600 opacity-60 cursor-not-allowed'
              }`}
              title={isMember ? `Switch to ${team.name}` : `Access Restricted: Not a member of ${team.name}`}
            >
              <div className="flex items-center gap-2 truncate">
                <span 
                  className="w-1.5 h-1.5 rounded-full shrink-0" 
                  style={{ backgroundColor: team.color }} 
                />
                <span className="truncate">{team.name}</span>
              </div>

              {isMember ? (
                isCurrent ? <Check className="w-3.5 h-3.5 text-[#3ecf8e]" /> : null
              ) : (
                <Lock className="w-3 h-3 text-neutral-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[#242424] bg-[#121212] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#3ecf8e] animate-pulse" />
          <span className="text-[11px] text-neutral-400 font-mono">RLS Guard Active</span>
        </div>

        <button
          onClick={resetWorkspaceData}
          className="p-1 text-neutral-500 hover:text-neutral-300 transition-colors"
          title="Reset Workspace to Template State"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
