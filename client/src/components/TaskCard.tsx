import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Calendar, CheckSquare, MessageSquare, AlertTriangle, 
  CheckCircle2, XCircle, Clock, ChevronDown, Sparkles 
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onDragEnd }) => {
  const { 
    setSelectedTask, 
    users, 
    moveTask, 
    columns, 
    currentUser 
  } = useApp();

  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const assignee = users.find(u => u.id === task.assigneeId);
  const reporter = users.find(u => u.id === task.reporterId);
  const tester = users.find(u => u.id === task.testerId);

  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30">Medium</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-neutral-700/30 text-neutral-400 border border-neutral-700/50">Low</span>;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'in_progress': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'testing': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'failed': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    setIsStatusMenuOpen(false);
    moveTask(task.id, newStatus);
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
        if (onDragStart) onDragStart(e, task.id);
      }}
      onDragEnd={(e) => {
        if (onDragEnd) onDragEnd(e);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsStatusMenuOpen(false);
      }}
      className={`group relative bg-[#1c1c1c] hover:bg-[#222222] border border-[#2a2a2a] hover:border-[#3ecf8e]/50 rounded-xl p-3.5 shadow-card-elevated hover:shadow-supabase-glow transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
        task.status === 'failed' ? 'border-rose-900/40 hover:border-rose-500/50' : ''
      }`}
    >
      {/* Top Header: Code, Priority, and Quick Select Box */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold text-neutral-400 group-hover:text-[#3ecf8e] transition-colors">
            {task.code}
          </span>
          {getPriorityBadge(task.priority)}
        </div>

        {/* Quick Status Select Box (Direct transition dropdown) */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsStatusMenuOpen(!isStatusMenuOpen);
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${getStatusColor(task.status)}`}
            title="Change Status"
          >
            <span>{columns.find(c => c.id === task.status)?.title.split('/')[0]}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {isStatusMenuOpen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-6 w-44 bg-[#181818] border border-[#333333] rounded-lg shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-2.5 py-1 text-[10px] font-semibold uppercase text-neutral-400 border-b border-[#2e2e2e]">
                Move Status
              </div>
              {columns.map(col => (
                <button
                  key={col.id}
                  onClick={() => handleStatusChange(col.id)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between hover:bg-[#252525] transition-colors ${
                    col.id === task.status ? 'text-[#3ecf8e] font-semibold bg-[#3ecf8e]/5' : 'text-neutral-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: col.color }} 
                    />
                    {col.title.split('/')[0]}
                  </span>
                  {col.id === task.status && <CheckCircle2 className="w-3.5 h-3.5 text-[#3ecf8e]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h4
        onClick={() => setSelectedTask(task)}
        className="text-sm font-semibold text-neutral-100 hover:text-[#3ecf8e] transition-colors line-clamp-2 leading-snug cursor-pointer mb-2"
      >
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#242424] text-neutral-300 border border-[#333333]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Subtasks Progress */}
      {totalSubtasks > 0 && (
        <div className="mb-3 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-neutral-400" />
              <span>Subtasks</span>
            </span>
            <span className="font-mono text-[10px]">{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                subtaskProgress === 100 ? 'bg-[#3ecf8e]' : 'bg-cyan-500'
              }`}
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tester Defect Alert Banner if Failed */}
      {task.status === 'failed' && task.testerNotes && (
        <div className="mb-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] flex items-start gap-1.5">
          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2 font-mono">{task.testerNotes}</span>
        </div>
      )}

      {/* Card Footer: Assignee, Due Date, and Stats */}
      <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-neutral-400 text-xs">
        <div className="flex items-center gap-2">
          {assignee ? (
            <div className="flex items-center gap-1.5" title={`Assigned to ${assignee.name}`}>
              <img
                src={assignee.avatar}
                alt={assignee.name}
                className="w-5 h-5 rounded-full object-cover border border-[#2e2e2e]"
              />
              <span className="text-[11px] text-neutral-300 truncate max-w-[90px]">
                {assignee.name.split(' ')[0]}
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-neutral-500 italic">Unassigned</span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[11px] text-neutral-400" title={`Due: ${task.dueDate}`}>
              <Calendar className="w-3 h-3" />
              <span>{task.dueDate.slice(5)}</span>
            </div>
          )}

          {task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-neutral-400" title={`${task.comments.length} comments`}>
              <MessageSquare className="w-3 h-3" />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
