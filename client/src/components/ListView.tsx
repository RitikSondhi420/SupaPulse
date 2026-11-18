import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus, TaskPriority } from '../types';
import { 
  ChevronDown, ChevronRight, CheckSquare, Calendar, 
  Trash2, ExternalLink, Plus, AlertOctagon 
} from 'lucide-react';

interface ListViewProps {
  onOpenNewTaskModal: (defaultStatus?: TaskStatus) => void;
}

export const ListView: React.FC<ListViewProps> = ({ onOpenNewTaskModal }) => {
  const { 
    visibleTasks, 
    columns, 
    moveTask, 
    deleteTask, 
    setSelectedTask, 
    users, 
    projects 
  } = useApp();

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (colId: string) => {
    setCollapsedSections(prev => ({ ...prev, [colId]: !prev[colId] }));
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">Medium</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-neutral-800 text-neutral-400 border border-neutral-700">Low</span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#121212]">
      <div className="max-w-7xl mx-auto space-y-6">
        {columns.map(column => {
          const sectionTasks = visibleTasks.filter(t => t.status === column.id);
          const isCollapsed = collapsedSections[column.id];

          return (
            <div key={column.id} className="rounded-2xl border border-[#242424] bg-[#161616] overflow-hidden">
              {/* Section Header */}
              <div
                onClick={() => toggleSection(column.id)}
                className="p-3.5 bg-[#1a1a1a] border-b border-[#242424] flex items-center justify-between cursor-pointer hover:bg-[#202020] transition-colors select-none"
              >
                <div className="flex items-center gap-2.5">
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: column.color }} 
                  />
                  <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wide">
                    {column.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#242424] text-neutral-400 border border-[#2e2e2e]">
                    {sectionTasks.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenNewTaskModal(column.id);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-300 hover:text-[#3ecf8e] hover:bg-[#252525] border border-transparent hover:border-[#3ecf8e]/30 flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>

              {/* Task Table */}
              {!isCollapsed && (
                <div className="overflow-x-auto">
                  {sectionTasks.length === 0 ? (
                    <div className="p-6 text-center text-xs text-neutral-500">
                      No tasks currently in {column.title}.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#242424] text-[11px] font-semibold text-neutral-400 uppercase tracking-wider bg-[#141414]">
                          <th className="py-2.5 px-4">Task Name</th>
                          <th className="py-2.5 px-3">Status Select</th>
                          <th className="py-2.5 px-3">Priority</th>
                          <th className="py-2.5 px-3">Assignee</th>
                          <th className="py-2.5 px-3">Due Date</th>
                          <th className="py-2.5 px-3">Subtasks</th>
                          <th className="py-2.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#202020]">
                        {sectionTasks.map(task => {
                          const assignee = users.find(u => u.id === task.assigneeId);
                          const project = projects.find(p => p.id === task.projectId);
                          const completedSubs = task.subtasks.filter(s => s.completed).length;

                          return (
                            <tr
                              key={task.id}
                              className="hover:bg-[#1d1d1d] group transition-colors cursor-pointer"
                              onClick={() => setSelectedTask(task)}
                            >
                              {/* Title & Code */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <span className="font-mono text-[11px] text-neutral-400 group-hover:text-[#3ecf8e] font-semibold shrink-0">
                                    {task.code}
                                  </span>
                                  <span className="text-neutral-200 font-medium group-hover:text-neutral-100 line-clamp-1">
                                    {task.title}
                                  </span>
                                  {project && (
                                    <span 
                                      className="px-1.5 py-0.2 rounded text-[9px] font-mono border shrink-0 text-neutral-400 border-neutral-700 bg-neutral-900"
                                      title={project.name}
                                    >
                                      {project.key}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Status Select Box (Direct Transition) */}
                              <td className="py-3 px-3" onClick={e => e.stopPropagation()}>
                                <select
                                  value={task.status}
                                  onChange={(e) => moveTask(task.id, e.target.value as TaskStatus)}
                                  className="px-2.5 py-1 rounded-lg bg-[#141414] border border-[#2e2e2e] text-neutral-200 focus:border-[#3ecf8e] focus:outline-none text-[11px] cursor-pointer"
                                >
                                  {columns.map(col => (
                                    <option key={col.id} value={col.id}>
                                      {col.title.split('/')[0]}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              {/* Priority */}
                              <td className="py-3 px-3">
                                {getPriorityBadge(task.priority)}
                              </td>

                              {/* Assignee */}
                              <td className="py-3 px-3">
                                {assignee ? (
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={assignee.avatar}
                                      alt={assignee.name}
                                      className="w-5 h-5 rounded-full object-cover border border-[#2e2e2e]"
                                    />
                                    <span className="text-neutral-300 truncate max-w-[120px]">
                                      {assignee.name}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-neutral-500 italic">Unassigned</span>
                                )}
                              </td>

                              {/* Due Date */}
                              <td className="py-3 px-3 text-neutral-400 font-mono text-[11px]">
                                {task.dueDate ? (
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3 text-neutral-500" />
                                    <span>{task.dueDate}</span>
                                  </div>
                                ) : (
                                  <span className="text-neutral-600">—</span>
                                )}
                              </td>

                              {/* Subtasks */}
                              <td className="py-3 px-3">
                                {task.subtasks.length > 0 ? (
                                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-neutral-400">
                                    <CheckSquare className="w-3 h-3 text-[#3ecf8e]" />
                                    <span>{completedSubs}/{task.subtasks.length}</span>
                                  </span>
                                ) : (
                                  <span className="text-neutral-600">—</span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedTask(task)}
                                    className="p-1 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
                                    title="Open Details"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteTask(task.id)}
                                    className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                                    title="Delete Task"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
