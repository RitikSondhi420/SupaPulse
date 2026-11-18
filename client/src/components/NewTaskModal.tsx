import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskStatus, TaskPriority } from '../types';
import { Plus, X, Sparkles, Tag, CheckSquare, Calendar, User, Layers } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStatus?: TaskStatus;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultStatus = 'pending' 
}) => {
  const { 
    currentTeam, 
    teamProjects, 
    columns, 
    users, 
    createTask, 
    currentUser 
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(teamProjects[0]?.id || '');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState<string>('unassigned');
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [subtaskInput, setSubtaskInput] = useState('');

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks(prev => [...prev, { id: 'st_' + Date.now(), title: subtaskInput.trim(), completed: false }]);
    setSubtaskInput('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    createTask({
      title: title.trim(),
      description: description.trim(),
      projectId: projectId || teamProjects[0]?.id || 'proj_default',
      teamId: currentTeam.id,
      status,
      priority,
      assigneeId: assigneeId === 'unassigned' ? undefined : assigneeId,
      reporterId: currentUser.id,
      dueDate: dueDate || undefined,
      tags: parsedTags,
      subtasks
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#262626] bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 text-[#3ecf8e]">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-100">Create New Project Task</h3>
              <p className="text-[11px] text-neutral-400">
                Team: <span className="text-[#3ecf8e] font-semibold">{currentTeam.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Implement schema caching with Redis"
              className="w-full px-3.5 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-xs text-neutral-200"
              required
              autoFocus
            />
          </div>

          {/* Project & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide mb-1.5">
                Target Project
              </label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-xs text-neutral-200 cursor-pointer"
              >
                {teamProjects.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.key}] {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide mb-1.5">
                Initial Workflow Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-xs text-neutral-200 cursor-pointer"
              >
                {columns.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority & Assignee */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-xs text-neutral-200 cursor-pointer"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide mb-1.5">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={e => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-xs text-neutral-200 cursor-pointer"
              >
                <option value="unassigned">Unassigned</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date & Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-xs text-neutral-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Backend, API, Security"
                className="w-full px-3 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-xs text-neutral-200"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide mb-1.5">
              Description & Acceptance Criteria
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Outline what needs to be implemented or tested..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-xs text-neutral-200 leading-relaxed"
            />
          </div>

          {/* Subtasks input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide">
              Subtasks
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={subtaskInput}
                onChange={e => setSubtaskInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add subtask item..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#3ecf8e] focus:outline-none text-xs text-neutral-200"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-xl bg-[#1e2721] hover:bg-[#25352c] text-[#3ecf8e] border border-[#3ecf8e]/30 text-xs font-semibold"
              >
                Add
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1 pt-1">
                {subtasks.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-[#141414] border border-[#242424] text-xs">
                    <span className="text-neutral-300">{s.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(s.id)}
                      className="text-neutral-500 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-neutral-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#3ecf8e] hover:bg-[#34b27b] text-neutral-950 font-bold text-xs shadow-[0_0_15px_rgba(62,207,142,0.3)] transition-all"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
