import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskCard } from './TaskCard';
import { TaskStatus, ColumnDefinition } from '../types';
import { 
  Plus, MoreHorizontal, Filter, Search, 
  ArrowUpDown, Layers, CheckCircle2, AlertOctagon, 
  Clock, PlayCircle, ShieldCheck, Sparkles 
} from 'lucide-react';

interface KanbanBoardProps {
  onOpenNewTaskModal: (defaultStatus?: TaskStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onOpenNewTaskModal }) => {
  const { 
    visibleTasks, 
    columns, 
    moveTask, 
    currentTeam, 
    currentProject,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    filterAssignee,
    setFilterAssignee,
    users
  } = useApp();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<TaskStatus | null>(null);

  // Group visible tasks by status
  const tasksByColumn: Record<TaskStatus, typeof visibleTasks> = {
    pending: [],
    in_progress: [],
    testing: [],
    completed: [],
    failed: []
  };

  visibleTasks.forEach(task => {
    if (tasksByColumn[task.status]) {
      tasksByColumn[task.status].push(task);
    }
  });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setActiveDropColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColumn !== colId) {
      setActiveDropColumn(colId);
    }
  };

  const handleDragLeave = (colId: TaskStatus) => {
    if (activeDropColumn === colId) {
      setActiveDropColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setActiveDropColumn(null);
    setDraggedTaskId(null);

    if (taskId) {
      moveTask(taskId, colId);
    }
  };

  const getColumnIcon = (id: TaskStatus) => {
    switch (id) {
      case 'pending': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'in_progress': return <PlayCircle className="w-4 h-4 text-cyan-400" />;
      case 'testing': return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-[#3ecf8e]" />;
      case 'failed': return <AlertOctagon className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#121212]">
      {/* Top Filter & Action Bar */}
      <div className="px-6 py-3 border-b border-[#242424] bg-[#161616]/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 min-w-[240px] max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tasks, IDs, tags, or keys..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-[#1e1e1e] border border-[#2e2e2e] focus:border-[#3ecf8e] text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-neutral-500 hover:text-neutral-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 text-xs">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 text-[11px] font-medium">Priority:</span>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#1e1e1e] border border-[#2e2e2e] text-neutral-300 focus:border-[#3ecf8e] focus:outline-none text-xs"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 text-[11px] font-medium">Assignee:</span>
            <select
              value={filterAssignee}
              onChange={e => setFilterAssignee(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#1e1e1e] border border-[#2e2e2e] text-neutral-300 focus:border-[#3ecf8e] focus:outline-none text-xs max-w-[140px] truncate"
            >
              <option value="all">All Members</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* Quick Clear */}
          {(searchQuery || filterPriority !== 'all' || filterAssignee !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterPriority('all');
                setFilterAssignee('all');
              }}
              className="text-[11px] text-[#3ecf8e] hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Board Canvas (Horizontal scrolling columns) */}
      <div className="flex-1 overflow-x-auto p-6 flex gap-5 items-start">
        {columns.map(column => {
          const colTasks = tasksByColumn[column.id] || [];
          const isDropActive = activeDropColumn === column.id;

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={() => handleDragLeave(column.id)}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`w-80 shrink-0 flex flex-col rounded-2xl bg-[#161616] border transition-all duration-200 ${
                isDropActive 
                  ? 'border-[#3ecf8e] shadow-[0_0_20px_rgba(62,207,142,0.2)] bg-[#19221d]' 
                  : 'border-[#262626]'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-[#242424] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#1e1e1e] border border-[#2e2e2e]">
                    {getColumnIcon(column.id)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-200">
                      {column.title}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#222222] text-neutral-400 border border-[#2e2e2e]">
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenNewTaskModal(column.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-[#3ecf8e] hover:bg-[#222222] transition-colors"
                    title={`Add task to ${column.title}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="p-3 space-y-3 min-h-[500px] max-h-[calc(100vh-240px)] overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div
                    onClick={() => onOpenNewTaskModal(column.id)}
                    className={`h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-colors ${
                      isDropActive
                        ? 'border-[#3ecf8e]/60 bg-[#3ecf8e]/5 text-[#3ecf8e]'
                        : 'border-[#262626] hover:border-neutral-700 text-neutral-500'
                    }`}
                  >
                    <Plus className="w-5 h-5 mb-1 opacity-60" />
                    <span className="text-xs font-medium">Drop tasks here</span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">or click to add new</span>
                  </div>
                ) : (
                  <>
                    {colTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      />
                    ))}

                    {/* Quick Add Button at bottom of list */}
                    <button
                      onClick={() => onOpenNewTaskModal(column.id)}
                      className="w-full py-2 px-3 rounded-xl border border-dashed border-[#2a2a2a] hover:border-[#3ecf8e]/40 hover:bg-[#1a241e] text-neutral-400 hover:text-[#3ecf8e] text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Task</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
