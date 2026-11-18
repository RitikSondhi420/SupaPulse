import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../types';
import { 
  X, Calendar, CheckSquare, MessageSquare, AlertTriangle, 
  CheckCircle2, XCircle, Clock, Trash2, Tag, Send, 
  ShieldCheck, AlertOctagon, UserCheck, History, ChevronRight 
} from 'lucide-react';

export const TaskDetailModal: React.FC = () => {
  const { 
    selectedTask, 
    setSelectedTask, 
    columns, 
    moveTask, 
    updateTask, 
    deleteTask, 
    toggleSubtask, 
    addSubtask, 
    addComment, 
    updateTesterVerdict,
    users, 
    teamProjects, 
    currentUser,
    currentTeam 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [commentText, setCommentText] = useState('');
  const [testerNotesInput, setTesterNotesInput] = useState(selectedTask?.testerNotes || '');

  if (!selectedTask) return null;

  const assignee = users.find(u => u.id === selectedTask.assigneeId);
  const reporter = users.find(u => u.id === selectedTask.reporterId);
  const tester = users.find(u => u.id === selectedTask.testerId);
  const project = teamProjects.find(p => p.id === selectedTask.projectId);

  const isTesterOrAdmin = currentUser.role === 'Admin' || currentUser.role === 'Tester';

  const handleStatusChange = (newStatus: TaskStatus) => {
    moveTask(selectedTask.id, newStatus);
  };

  const handlePriorityChange = (newPriority: TaskPriority) => {
    updateTask(selectedTask.id, { priority: newPriority });
  };

  const handleAssigneeChange = (userId: string) => {
    updateTask(selectedTask.id, { assigneeId: userId === 'unassigned' ? undefined : userId });
  };

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(selectedTask.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(selectedTask.id, commentText.trim());
    setCommentText('');
  };

  const handleTesterPass = () => {
    updateTesterVerdict(selectedTask.id, true, testerNotesInput || 'All QA checks and acceptance criteria verified.');
  };

  const handleTesterFail = () => {
    if (!testerNotesInput.trim()) {
      alert('Please provide defect notes or failure details before marking as Failed.');
      return;
    }
    updateTesterVerdict(selectedTask.id, false, testerNotesInput.trim());
  };

  const completedSubs = selectedTask.subtasks.filter(s => s.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl h-full bg-[#181818] border-l border-[#2e2e2e] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Top Header */}
        <div className="p-4 border-b border-[#262626] bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#3ecf8e] px-2 py-0.5 rounded bg-[#3ecf8e]/10 border border-[#3ecf8e]/30">
              {selectedTask.code}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              in {project?.name || currentTeam.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => deleteTask(selectedTask.id)}
              className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedTask(null)}
              className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#262626] bg-[#151515] px-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-[#3ecf8e] text-[#3ecf8e]'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Task Overview & Subtasks</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'activity'
                ? 'border-[#3ecf8e] text-[#3ecf8e]'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Comments & Audit History ({selectedTask.comments.length + selectedTask.activity.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'details' ? (
            <>
              {/* Task Title Input */}
              <div>
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) => updateTask(selectedTask.id, { title: e.target.value })}
                  className="w-full text-lg font-bold text-neutral-100 bg-transparent border-b border-transparent hover:border-[#333333] focus:border-[#3ecf8e] focus:outline-none transition-colors py-1"
                  placeholder="Task title..."
                />
              </div>

              {/* Status, Priority, Assignee Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#141414] border border-[#242424]">
                {/* Status Selector */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-neutral-400 mb-1.5">
                    Workflow Status
                  </label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#2e2e2e] text-neutral-200 focus:border-[#3ecf8e] focus:outline-none text-xs font-medium cursor-pointer"
                  >
                    {columns.map(col => (
                      <option key={col.id} value={col.id}>
                        {col.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Selector */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-neutral-400 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#2e2e2e] text-neutral-200 focus:border-[#3ecf8e] focus:outline-none text-xs font-medium cursor-pointer"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Assignee Selector */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-neutral-400 mb-1.5">
                    Assignee
                  </label>
                  <select
                    value={selectedTask.assigneeId || 'unassigned'}
                    onChange={(e) => handleAssigneeChange(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#2e2e2e] text-neutral-200 focus:border-[#3ecf8e] focus:outline-none text-xs font-medium cursor-pointer"
                  >
                    <option value="unassigned">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-neutral-400 mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={selectedTask.dueDate || ''}
                    onChange={(e) => updateTask(selectedTask.id, { dueDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#2e2e2e] text-neutral-200 focus:border-[#3ecf8e] focus:outline-none text-xs font-mono"
                  />
                </div>
              </div>

              {/* QA & Tester Action Panel (Highlighted for testers/users) */}
              <div className="p-4 rounded-xl bg-[#1c1a24] border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wide">
                      QA Tester Verification Gate
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                    Role: {currentUser.role}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  Testers and Admins can test code in staging, record test notes, and click to immediately 
                  pass into <strong>Completed</strong> or reject into <strong>Failed / Rejected</strong>.
                </p>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                    Tester Notes / Defect Reproduction / Staging Logs:
                  </label>
                  <textarea
                    rows={2}
                    value={testerNotesInput}
                    onChange={(e) => setTesterNotesInput(e.target.value)}
                    onBlur={() => updateTask(selectedTask.id, { testerNotes: testerNotesInput })}
                    placeholder="e.g. Staging build verified. Latency is 12ms. Zero memory leaks detected."
                    className="w-full px-3 py-2 rounded-lg bg-[#121212] border border-[#333333] focus:border-purple-500 focus:outline-none text-xs text-neutral-200 font-mono"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleTesterPass}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pass & Mark Completed</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTesterFail}
                    className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-neutral-100 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Fail & Reject</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={selectedTask.description}
                  onChange={(e) => updateTask(selectedTask.id, { description: e.target.value })}
                  placeholder="Add detailed task specs, reproduction steps, or context..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-[#262626] focus:border-[#3ecf8e] focus:outline-none text-xs text-neutral-200 leading-relaxed"
                />
              </div>

              {/* Subtasks Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#3ecf8e]" />
                    <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wide">
                      Subtasks Checklist
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    {completedSubs}/{selectedTask.subtasks.length} Completed
                  </span>
                </div>

                <div className="space-y-1.5">
                  {selectedTask.subtasks.map(sub => (
                    <div
                      key={sub.id}
                      onClick={() => toggleSubtask(selectedTask.id, sub.id)}
                      className="p-2.5 rounded-lg bg-[#141414] hover:bg-[#191919] border border-[#242424] flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => {}}
                        className="rounded border-[#333333] text-[#3ecf8e] focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-xs flex-1 ${sub.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add Subtask Input */}
                <form onSubmit={handleAddSubtaskSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add a new checklist item..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#141414] border border-[#262626] focus:border-[#3ecf8e] focus:outline-none text-xs text-neutral-200"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-[#1f2923] hover:bg-[#283830] text-[#3ecf8e] border border-[#3ecf8e]/30 text-xs font-semibold"
                  >
                    Add
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Activity & Comments Tab */
            <div className="space-y-6">
              {/* Post Comment Box */}
              <form onSubmit={handleCommentSubmit} className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-300">
                  Leave a Note / Comment
                </label>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Mention team members, report test results, or leave notes..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#141414] border border-[#262626] focus:border-[#3ecf8e] focus:outline-none text-xs text-neutral-200"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#3ecf8e] hover:bg-[#34b27b] text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Comment</span>
                  </button>
                </div>
              </form>

              {/* Comments Thread */}
              {selectedTask.comments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Comments ({selectedTask.comments.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedTask.comments.map(c => (
                      <div key={c.id} className="p-3.5 rounded-xl bg-[#141414] border border-[#242424] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={c.userAvatar}
                              alt={c.userName}
                              className="w-5 h-5 rounded-full object-cover border border-[#2e2e2e]"
                            />
                            <span className="text-xs font-bold text-neutral-200">{c.userName}</span>
                            <span className="text-[10px] px-1.5 rounded bg-neutral-800 text-neutral-400">
                              {c.userRole}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed pl-7">
                          {c.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audit Log / History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Transition Audit Trail
                </h4>
                <div className="space-y-2 border-l-2 border-[#262626] ml-2 pl-4">
                  {selectedTask.activity.map(act => (
                    <div key={act.id} className="relative text-xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-300">{act.userName}</span>
                        <span className="text-neutral-400">{act.action}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {new Date(act.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
